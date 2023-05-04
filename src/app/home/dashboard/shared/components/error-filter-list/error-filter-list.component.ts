import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Subject, Subscription } from 'rxjs';
import { ErrorFilterTitle } from '../../../../../shared/enums/error-tab.enum';
import { ErrorService } from '../errors-tab/error.service';

@Component({
  selector: 'app-error-filter-list',
  templateUrl: './error-filter-list.component.html',
  styleUrls: ['./error-filter-list.component.scss'],
})
export class ErrorFilterListComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() listData: any[];
  @Input() labelKey: string;
  @Input() imgLabelKey: string;
  @Input() clearNotifier: Subject<boolean>;
  @Input() triStateCheckboxNotifier: Subject<boolean>;
  public titleConstant = ErrorFilterTitle;
  public fullName: string;
  public allSelected = false;
  public indeterminate = false;
  @ViewChild(PerfectScrollbarDirective, { static: false })
  directiveRef?: PerfectScrollbarDirective;
  @Output() filterSelection: EventEmitter<string[]> = new EventEmitter();
  public triStateCheckbox$: Subscription;
  constructor(private errorService: ErrorService) { }

  ngOnInit(): void {
    this.clearAll();
    this.setTriStateCheckboxState();
  }

  private setTriStateCheckboxState(): void {
    this.allSelected = this.indeterminate = false;
    this.allSelected = this.listData && this.listData.every(data => data.selected);
    if (!this.allSelected) {
      this.indeterminate = this.listData && this.listData.some(data => data.selected);
    }

  }

  ngOnChanges():void {
    this.allSelected = this.indeterminate = false;
    if (this.title === this.titleConstant.ASSIGNEE && this.listData) {
      this.splitUserName();
    }
  }

  public onSelection(): void {
    this.allSelected = this.listData && this.listData.every(data => data.selected);
    this.addSelection();
  }

  public onClear(): void {
    if (this.listData && this.listData.length) {
      this.listData.forEach((data) => (data.selected = false));
    }
    this.allSelected = false;
    this.indeterminate = false;
    this.filterSelection.emit([]);
  }

  public onAllSelectionChange(event: boolean): void {
    this.allSelected = event;
    this.addSelection();
  }

  private addSelection(): void {
    const selection = [];
    if (this.listData && this.listData.length) {
      this.listData.forEach(value => {
        if (value.selected) {
          if (this.title === ErrorFilterTitle.ASSIGNEE) {
            selection.push({ "id": value.id, "name": value[this.labelKey] });
          } else {
            selection.push(value[this.labelKey]);
          }
        }
      });
    }
    this.filterSelection.emit(selection);
    this.indeterminate = !!(selection.length && !this.allSelected);
  }

  private clearAll(): void {
    if (this.clearNotifier) {
      this.clearNotifier.subscribe(() => {
        this.onClear();
      });
    }
  }

  private splitUserName(): void {
    this.listData.forEach((data, index) => {
      this.listData[index]['fullName'] = data[this.labelKey];
      const name = data[this.labelKey].split(' ');
      if (name[1]) {
        const last = name[1].split('');
        this.listData[index][this.labelKey] = name[0] + ' ' + last[0] + '.';
      }
    });
  }
}
