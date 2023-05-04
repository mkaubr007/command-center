import { Component, Injector, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MessageConstant } from '../../../../core/constants/message.constant';
import { ProcessesTable } from '../../../../shared/enums/cosa-nostra/process-table-columns.enum';
import { OrderBy, SortBy } from '../../../../shared/enums/sorting.enum';
import { Processes, ProcessParams } from '../../../../shared/models/cosa-nostra/process.model';
import { IErrorResponse } from '../../../../shared/models/error/error.interface';
import { IPaginator } from '../../../../shared/models/paginator/paginator.interface';
import { Popup } from '../../../../shared/models/popup/popup.model';
import { ISorting } from '../../../../shared/models/sorting/sorting.interface';
import { SharedService } from '../../../../shared/shared.service';
import { ProcessService } from '../../services/process.service';

@Component({
  selector: 'app-link-process',
  templateUrl: './link-process.component.html',
  styleUrls: ['./link-process.component.scss']
})
export class LinkProcessComponent implements OnInit {

public isDataLoading = true;
public messageConstants = MessageConstant;
public displayedColumns: string[] = [
  ProcessesTable.CHECKBOX,
  ProcessesTable.PROCESS,
  ProcessesTable.DISPLAY_NAME,
  ProcessesTable.ASSEMBLY,
  ProcessesTable.FAILURE_FATAL
]; 

public argumentId: string;
public selectedProcessesList = [];
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
public placeholder = "Search a process";
public processesData: Popup;

public dataSource: MatTableDataSource<Processes> = new MatTableDataSource<Processes>();
  
  public dialogRef;
  constructor(
    private _processService: ProcessService,
    private _sharedService: SharedService,
    public _dialog: MatDialog, 
    private _injector: Injector
  ) {
    this.dialogRef = this._injector.get(MatDialogRef, null);
    this.processesData = this._injector.get(MAT_DIALOG_DATA, null);
   }

  ngOnInit() {

    this.isDataLoading = true;
    if(this.processesData.data && Object.keys(this.processesData.data).length > 0) {
      this.selectedEnvironment = this.processesData.data.selectedEnvironment;
      this.selectedProcessesList = this.processesData.data.alreadyLinkedProcesses;
      this.argumentId = this.processesData.data.argumentId;
    }
    this.prepareGetAllProcess(true);
  }

  public onSelection(arg: Processes): void {
    if(arg.selected) {
      this.selectedProcessesList.push(arg);
    }
    else {
      const findIndex = this.selectedProcessesList.findIndex(x => x._id === arg._id);
      if(findIndex > -1) {
        this.selectedProcessesList.splice(findIndex, 1);
      }
    }
  }

  public searchProcesses(): void {
    this.prepareGetAllProcess(false);
  }

  private prepareGetAllProcess(isDataLoading: boolean) {
    this.isDataLoading = isDataLoading;
    this.getAllProcess(this.selectedEnvironment, this.searchKeyword, this.defaultSortBy.sort, this.defaultSortBy.order, this.defaultPageLimit, this.currentPage);
  }

  private getAllProcess(environment: string, searchKeyword: string, sortBy: SortBy, orderBy: OrderBy, limit: number, page: number) {
    this._sharedService.startBlockUI();
    this.isSearch = (this.searchKeyword && this.searchKeyword !== '');
    this._processService.getAllProcesses(this.selectedEnvironment, searchKeyword, sortBy, orderBy, limit, page, "published")
    .subscribe(
      (response: ProcessParams) => {
        this.setProcessList(response);
      },
      (error) => {
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  private setProcessList(response: ProcessParams) {
    const argList = response.result;
    if(argList && argList.length > 0) {
      argList.map((arg: Processes) => {
        arg.selected = this.isProcessSelected(arg);
      });
    }
    this.dataSource = new MatTableDataSource<Processes>(argList);
    this.totalLength = response.count;
    this._sharedService.stopBlockUI();
    this.isDataLoading = false;
  }

  isProcessSelected(process: Processes): boolean {
    if(this.selectedProcessesList && this.selectedProcessesList.length > 0) {
      const isFound = this.selectedProcessesList.find(p => p._id === process._id);
      if(isFound) {
        return true;
      }
    }
    return false;
  }

  public onClear(event: any): void {
    this.searchKeyword = '';
    this.searchProcesses();
  }

  public handleError(error: IErrorResponse): void {
    this.isDataLoading = true;
    this._sharedService.openErrorSnackBar(error);
    this._sharedService.stopBlockUI();
  }

  public saveLinkedProcessClicked(e):void{
    this.dialogRef.close(this.selectedProcessesList);
  }

  public closePopupClicked(e):void{
    this.dialogRef.close(null);
  }

  public changePageSize(pageSize: number): void {
    this.defaultPageLimit = pageSize;
    this.currentPage = 1;
    this.searchProcesses();
  }

  public changePage(event: IPaginator): void {
    this.currentPage = event.pageIndex + 1;
    this.searchProcesses();
  }

  public sortColumn(event: ISorting): void {
    
  }
}


