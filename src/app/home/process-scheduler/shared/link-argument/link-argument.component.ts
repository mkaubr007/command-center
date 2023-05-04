import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MessageConstant } from '../../../../core/constants/message.constant';
import { ProcessArgumentsTable } from '../../../../shared/enums/cosa-nostra/process-arguments-table-columns.enum';
import { OrderBy, SortBy, Sorting } from '../../../../shared/enums/sorting.enum';
import { ProcessArgument, ProcessArgumentsParams } from '../../../../shared/models/cosa-nostra/process-arguments.model';
import { IErrorResponse } from '../../../../shared/models/error/error.interface';
import { IPaginator } from '../../../../shared/models/paginator/paginator.interface';
import { Popup } from '../../../../shared/models/popup/popup.model';
import { ISorting } from '../../../../shared/models/sorting/sorting.interface';
import { SharedService } from '../../../../shared/shared.service';
import { ProcessArgumentsService } from '../../services/process-arguments.service';

@Component({
  selector: 'app-link-argument',
  templateUrl: './link-argument.component.html',
  styleUrls: ['./link-argument.component.scss']
})
export class LinkArgumentComponent implements OnInit {

public isDataLoading = true;
public messageConstants = MessageConstant;
public displayedColumns: string[] = [
  ProcessArgumentsTable.CHECKBOX,
  ProcessArgumentsTable.ARGUMENTS,
  ProcessArgumentsTable.NAME_SPACE,
  ProcessArgumentsTable.TYPE,
  ProcessArgumentsTable.VALUE
]; 

public parentId: string;
public selectedArgumentsList = [];
public currentPage = 1;
public defaultPageLimit = 10;
public totalLength = 0;
public defaultSortBy: { sort: SortBy; order: OrderBy } = { sort: SortBy.NAME, order: OrderBy.ASC };
public sortByRef = SortBy;
public orderByRef = OrderBy;
public selectedEnvironment = '';

public isSearch: boolean = false;
public searchKeyword = '';
public title: string;
public subTitle: string;
public noSearchResults = false;
public placeholder = "Search an argument";
public argumentsData: Popup;

public dataSource: MatTableDataSource<ProcessArgument> = new MatTableDataSource<ProcessArgument>();
  
  public dialogRef;
  constructor(
    private _argumentsService: ProcessArgumentsService,
    private _sharedService: SharedService,
    public _dialog: MatDialog, 
    private _injector: Injector
  ) {
    this.dialogRef = this._injector.get(MatDialogRef, null);
    this.argumentsData = this._injector.get(MAT_DIALOG_DATA, null);
   }

  ngOnInit() {

    this.isDataLoading = true;
    if(this.argumentsData.data && Object.keys(this.argumentsData.data).length > 0) {
      this.selectedEnvironment = this.argumentsData.data.selectedEnvironment;
      this.selectedArgumentsList = this.argumentsData.data.alreadyLinkedArguments;
      this.parentId = this.argumentsData.data.parentId;
    }
    this.prepareGetAllArguments(true);
  }

  public onSelection(arg: ProcessArgument): void {
    if(arg.selected) {
      this.selectedArgumentsList.push(arg);
    }
    else {
      const findIndex = this.selectedArgumentsList.findIndex(x => x._id === arg._id);
      if(findIndex > -1) {
        this.selectedArgumentsList.splice(findIndex, 1);
      }
    }
  }

  public searchArguments(): void {
    this.prepareGetAllArguments(false);
  }

  private prepareGetAllArguments(isDataLoading: boolean) {
    this.isDataLoading = isDataLoading;
    this.getAllArguments(this.selectedEnvironment, this.searchKeyword, this.defaultSortBy.sort, this.defaultSortBy.order, this.defaultPageLimit, this.currentPage);
  }

  private getAllArguments(environment: string, searchKeyword: string, sortBy: SortBy, orderBy: OrderBy, limit: number, page: number) {
    this._sharedService.startBlockUI();
    this.isSearch = (this.searchKeyword && this.searchKeyword !== '');
    this._argumentsService.getArguments(environment, searchKeyword, sortBy, orderBy, limit, page)
    .subscribe(
      (response: ProcessArgumentsParams) => {
        this.setArgumentsList(response);
      },
      (error) => {
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  private setArgumentsList(response: ProcessArgumentsParams) {

    const argList = response.result;

    if(argList && argList.length > 0) {
      const filteredList = argList.filter(x => x._id != this.parentId);
      filteredList.map((arg: ProcessArgument) => {
        arg.selected = this.isArgumentSelected(arg);
      });
      this.dataSource = new MatTableDataSource<ProcessArgument>(filteredList);
    }
    this.totalLength = response.count > 0 ? response.count - 1 : 0;
    this._sharedService.stopBlockUI();
    this.isDataLoading = false;
  }

  isArgumentSelected(argument: ProcessArgument): boolean {
    if(this.selectedArgumentsList && this.selectedArgumentsList.length > 0) {
      const isFound = this.selectedArgumentsList.find(arg => arg._id === argument._id);
      if(isFound) {
        return true;
      }
    }
    return false;
  }

  public onClear(event: any): void {
    this.searchKeyword = '';
    this.searchArguments();
  }

  public handleError(error: IErrorResponse): void {
    this.isDataLoading = true;
    this._sharedService.openErrorSnackBar(error);
    this._sharedService.stopBlockUI();
  }

  public saveLinkedArgumentsClicked(e):void{
    this.dialogRef.close(this.selectedArgumentsList);
  }

  public closePopupClicked(e):void{
    this.dialogRef.close(null);
  }

  public changePageSize(pageSize: number): void {
    this.defaultPageLimit = pageSize;
    this.currentPage = 1;
    this.searchArguments();
  }

  public changePage(event: IPaginator): void {
    this.currentPage = event.pageIndex + 1;
    this.searchArguments();
  }

  public sortColumn(event: ISorting): void {
    
  }
}


