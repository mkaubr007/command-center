import { ViewContainerRef,Renderer2,Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { ErrorFilterTitle } from '../../../../../shared/enums/error-tab.enum';
import { ErrorService } from '../errors-tab/error.service';
import { ErrorConstants } from '../errors-tab/shared/constants/error.constants';

@Component({
  selector: 'app-error-filter',
  templateUrl: './error-filter.component.html',
  styleUrls: ['./error-filter.component.scss'],
})
export class ErrorFilterComponent implements OnInit, OnDestroy {
  @Input() selectedTab: string;
  public clearAll = new Subject<boolean>();
  public titleConstant = ErrorFilterTitle;
  public messageConstant = ErrorConstants;
  public readonly ERROR_IMAGE_PATH = '../../../assets/images/errors/error.svg';
  @Output() apply: EventEmitter<boolean> = new EventEmitter();
  public filterListDataClone: any;
  public filterSelectionClone: any;
  public onFilterClick$: Subscription;
  public test=true;
  constructor(public errorService: ErrorService,private renderer: Renderer2,private viewChildRef: ViewContainerRef) { }

  ngOnInit(): void {
   
          this.filterListDataClone = cloneDeep(this.errorService.filterListData);
          this.filterSelectionClone = cloneDeep(this.errorService.filterSelection);
   
  }

  ngOnDestroy():void {
    this.clearAll.complete();
  }

  public onClearAll(): void {
    this.clearAll.next(true);
  }

  public onApply(): void {
    this.errorService.getErrorsByFilter.next(true);
    this.apply.emit(true);
  }

  public filterSelection(event: string[], key: string): void {
    this.errorService.filterSelection[key] = event;
  }

  public onClose(): void {
    this.errorService.filterListData = this.filterListDataClone;
    this.errorService.filterSelection = this.filterSelectionClone;
    this.apply.emit(true);
  }
}
