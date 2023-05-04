import {
  Component,
  Input,
  Renderer2,
  ViewContainerRef,
  Output,
  EventEmitter,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild, OnChanges, SimpleChanges
} from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { IPaginator } from '../../../../shared/models/paginator/paginator.interface';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { PaginatorConstant } from './paginator.constant';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent implements AfterViewInit, OnChanges {
  @Input('type') type: string;
  @Input('length') length: number;
  @Input('pageSize') pageSize: number;
  @Input('text') text: string;
  @Input('pageIndex') pageIndex: number;
  @Output('page') page: EventEmitter<PageEvent> = new EventEmitter();
  @Output('changedPageSize') changedPageSize: EventEmitter<
    number
  > = new EventEmitter();
  manualPage: number = 1;
  newPageSize: number;
  pageNumber = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(PerfectScrollbarDirective, { static: false })
  directiveRef?: PerfectScrollbarDirective;

  constructor(
    private renderer: Renderer2,
    private viewChildRef: ViewContainerRef
    ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.length && changes.length.currentValue !==  changes.length.previousValue) {
      this.setGoto();
    }
  }

  ngAfterViewInit(): void {
    this.newPageSize = this.pageSize;
    this.setGoto();
    this.createPaginatorHTML();
  }

  public updateManualPage(index: number): void {
    this.manualPage = index;
    const event = {
      length: this.length,
      pageIndex: index - 1,
      pageSize: this.pageSize,
    };
    this.page.emit(event);
    this.paginator.pageIndex = index - 1;
  }

  public setPage(event: IPaginator): void {
    this.manualPage = event.pageIndex + 1;
    this.page.emit(event);
  }

  public updatePageSize(index?: number, event?: MouseEvent | KeyboardEvent): void {
    if(this.pageSize > this.length) {
      this.pageSize = this.length;
    }

    if (
      +this.newPageSize === +this.pageSize ||
      event && !(event['code'] === PaginatorConstant.EVENT_CODE ||
      event['type'] === PaginatorConstant.FOCUSOUT_CODE))  {
      return;
    }

    this.manualPage = index || 1;

    this.newPageSize = this.pageSize;
    this.setGoto();
    if (!index) {
      this.changedPageSize.emit(this.pageSize);
    }
  }

  public setGoto(): void {
    this.pageNumber = [];
    if (Math.round(this.length / this.pageSize) !== Infinity) {
      for (let i = 1; i <= this.length / this.pageSize; i++) {
        this.pageNumber.push(i);
      }
      if (this.length % this.pageSize) {
        this.pageNumber.push(this.pageNumber.length + 1);
      }
    }
  }

  public createPaginatorHTML(): void {
    const actionContainer1 = this.viewChildRef.element.nativeElement.querySelector(
      'button.mat-paginator-navigation-previous'
    );

    const actionContainer2 = this.viewChildRef.element.nativeElement.querySelector(
      'button.mat-paginator-navigation-next'
    );

    const button1 = this.renderer.createElement('span');
    const textPrevious = this.renderer.createText('Previous');
    this.renderer.addClass(button1, 'left');
    this.renderer.appendChild(button1, textPrevious);
    this.renderer.appendChild(actionContainer1, button1);
    const button2 = this.renderer.createElement('span');
    const textNext = this.renderer.createText('Next');
    this.renderer.appendChild(button2, textNext);
    this.renderer.addClass(button2, 'right');
    this.renderer.appendChild(actionContainer2, button2);
  }

  public onlyDigitAndEnter(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    return !event.shiftKey &&
    (charCode >= 48 && charCode <= 57 || charCode === 8) &&
    (this.pageSize.toString() !== '' || event.key !== '0') ||
    charCode === 13;
  }

  public onPaste(event: ClipboardEvent): boolean {
    const onlyDigitsRegex = /^[0-9]+$/gm;
    const onlyZerosRegex = /^0*$/;
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('Text');
    const onlyZeros = onlyZerosRegex.test(pastedText);
    if(onlyZeros) {
      return false;
    } else {
      return onlyDigitsRegex.test(pastedText);
    }
  }
}
