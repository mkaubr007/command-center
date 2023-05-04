import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-process-header',
  templateUrl: './process-header.component.html',
  styleUrls: ['./process-header.component.scss']
})
export class ProcessHeaderComponent implements OnInit {
  @Input() title: any;
  @Input() count: number;
  @Input() placeholder: string;
  @Input() btnTitle: string;
  @Input() inputService: any;
  @Output() isBtnClicked = new EventEmitter();
  @Output() cleared = new EventEmitter();
  @Output() doSearch = new EventEmitter();
  public searchKeyword = '';

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  public onClick(): void {
    this.isBtnClicked.emit(true);
  }

  public getSearchInputValue(): void {
    if(this.searchKeyword) {
      this.inputService.searchValue.next(this.searchKeyword);
    }
  }

  public onClear($event){
   this.searchKeyword = '';
      this.inputService.searchValue.next(this.searchKeyword);
  }

  public onChange(event: string): void {
    if (!event) {
      this.cleared.emit(event);
    }
  }


}
