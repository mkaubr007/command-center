import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tri-state-checkbox',
  templateUrl: './tri-state-checkbox.component.html',
  styleUrls: ['./tri-state-checkbox.component.scss'],
})
export class TriStateCheckboxComponent implements OnInit {
  @Input() list: any[];
  @Input() label: string;
  @Input() allSelected: boolean;
  @Input() indeterminate: boolean;
  @Output() selectionChange: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  public selectAll(selected: boolean): void {
    this.allSelected = selected;
    if (!this.list) {
      return;
    }
    this.list.forEach((t) => (t.selected = selected));
    this.selectionChange.emit(this.allSelected);
  }
}
