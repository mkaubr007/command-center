import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CssConstant } from '../../../../core/constants/css.constant';
import { MessageConstant } from '../../../../core/constants/message.constant';
import { DeleteComponent } from '../../../../home/shared-home/components/delete/delete.component';
import { OrderBy, SortBy } from '../../../../shared/enums/cosa-nostra/process-arguments-sorting.enum';
import { ProcessUrlTab } from '../../../../shared/enums/teams-tab.enum';
import { ProcessArgument, ProcessArgumentsParams } from '../../../../shared/models/cosa-nostra/process-arguments.model';
import { IPaginator } from '../../../../shared/models/paginator/paginator.interface';
import { ApiResponse } from '../../../../shared/models/util/api-response';
import { SharedService } from '../../../../shared/shared.service';
import { ProcessArgumentsService } from '../../services/process-arguments.service';
import { ProcessSharedService } from '../../services/process-shared.service';
import { CreateArgumentComponent } from '../create-argument/create-argument.component';
import { LinkArgumentComponent } from '../link-argument/link-argument.component';

@Component({
  selector: 'app-manage-arguments',
  templateUrl: './manage-arguments.component.html',
  styleUrls: ['./manage-arguments.component.scss']
})
export class ManageArgumentsComponent implements OnInit {

  public messageConstants = MessageConstant;

  public defaultPageLimit = 10;
  public currentPage = 1;
  public defaultSortBy: { sort: SortBy; order: OrderBy } = { sort: SortBy.NAME, order: OrderBy.ASC };
  public sortByRef = SortBy;
  public orderByRef = OrderBy;
  public totalLength: number;
  public isDataLoading = false;
  public isSearch = false;
  public saerchKeyword = '';
  public selectedEnvironment;
  
  public argumentsList = [];
  public searchSubscription: Subscription;
  public clientEnvironmentSubscription: Subscription;

  constructor(public _dialog: MatDialog, 
              public _argumentsService: ProcessArgumentsService,
              private _sharedService: SharedService,
              private _route: ActivatedRoute,
              private _processSharedService: ProcessSharedService) { }

  ngOnInit(): void {
    this.isSearch = false;
    this.getCurrentFiltersSelection();
    this.subscribeToArgumentsSearch();
    this.subscribeToClientEnvironmentChange();
  }

  ngOnDestroy(): void {
    if(this.searchSubscription) {
      this.searchSubscription.unsubscribe();
      this.clientEnvironmentSubscription.unsubscribe();
    }
  }

  private getCurrentFiltersSelection() {
    const currentSelection = this._processSharedService.selectedClientEnvironment.value;
    if(currentSelection && currentSelection.environment && currentSelection.environment !== '') {
      this.selectedEnvironment = currentSelection.environment;
    }
  }

  private subscribeToArgumentsSearch(): void {
    this.searchSubscription = this._argumentsService.getSearchValue().subscribe((value) => {
      this.searchArguments(value);
    });
  }

  private subscribeToClientEnvironmentChange(): void {
    this.clientEnvironmentSubscription = this._processSharedService.getSelectedClientEnvironment().subscribe((value) => {
      if(value && value.environment) {
        this.selectedEnvironment = value.environment;
        this.prepareGetAllArguments(true);
      }
    });
  }

  private searchArguments(searchKeyword: string) {
    this.currentPage = 1;
    this.saerchKeyword = searchKeyword;
    this.getAllArguments(this.selectedEnvironment, searchKeyword, this.defaultSortBy.sort, this.defaultSortBy.order, this.defaultPageLimit, this.currentPage);
  }

  private prepareGetAllArguments(isDataLoading: boolean) {
    this.isDataLoading = isDataLoading;
    this.getAllArguments(this.selectedEnvironment, this.saerchKeyword, this.defaultSortBy.sort, this.defaultSortBy.order, this.defaultPageLimit, this.currentPage);
  }

  private getAllArguments(environment: string, searchKeyword: string, sortBy: SortBy, orderBy: OrderBy, limit: number, page: number) {
    this._sharedService.startBlockUI();
    this.isSearch = (searchKeyword && searchKeyword !== '');
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

  private deleteArgument(id: string) {
    this._argumentsService.deleteArgument(id)
    .subscribe(
      (response: ApiResponse<ProcessArgument>) => {
        if(response.statusCode == 200) {
          this.prepareGetAllArguments(true);
          this._sharedService.openSuccessSnackBar(response);
        }
        else {
          this._sharedService.openErrorSnackBar(MessageConstant.ARGUMENTS_TAB_ERROR);
        }
      },
      (error) => { 
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  private createArgument(argument: ProcessArgument) {
    this._argumentsService.createArgument(this.selectedEnvironment, argument)
    .subscribe(
      (response: ApiResponse<ProcessArgument>) => {
        if(response) {
          this.prepareGetAllArguments(true);
          this._sharedService.openSuccessSnackBar(response);
        }
        else {
          this._sharedService.openErrorSnackBar(MessageConstant.ARGUMENTS_TAB_ERROR);
        }
      },
      (error) => {
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  private editArgument(argument: ProcessArgument) {
    this._argumentsService.editArgument(this.selectedEnvironment, argument)
    .subscribe(
      (response: ApiResponse<ProcessArgument>) => {
        if(response) {
          this.prepareGetAllArguments(true);
          this._sharedService.openSuccessSnackBar(response);
        }
        else {
          this._sharedService.openErrorSnackBar(MessageConstant.ARGUMENTS_TAB_ERROR);
        }
      },
      (error) => {
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  linkArguments(argumentId: string, linkedArguments: ProcessArgument[]) {
    if(linkedArguments) {
      const mappedLinkedArguments = linkedArguments.map((x) => {
            return {
              id: x._id,
              order: x.order,
              overrideValue: null
            }
          });
      this._argumentsService.linkArguments(argumentId, mappedLinkedArguments)
      .subscribe(
        (response: ApiResponse<ProcessArgument>) => {
          if(response) {
            this.prepareGetAllArguments(true);
            this._sharedService.openSuccessSnackBar(response);
          }
          else {
            this._sharedService.openErrorSnackBar(MessageConstant.ARGUMENTS_TAB_ERROR);
          }
        },
        (error) => {
          this._sharedService.openErrorSnackBar(error);
        }
      );
    }
  }

  getOrderedSubArguments(subArguments: ProcessArgument[]) {
    return subArguments.sort((a,b) => a.order?.toString().localeCompare(b.order?.toString()));
  }

  private setArgumentsList(response: ProcessArgumentsParams) {
    this.argumentsList = response.result;
    this.totalLength = response.count;
    this._sharedService.stopBlockUI();
    this.isDataLoading = false;
  }

  createArgumentClicked(event: boolean): void {
    if (event) {
      this.openCreateArgumentPopup();
    }
  }

  changeSortOrderClicked(sortField: SortBy) {
    switch(this.defaultSortBy.order) {
      case OrderBy.ASC:
        if(sortField == this.defaultSortBy.sort) {
          this.defaultSortBy.order = OrderBy.DESC;
        }
        else {
          this.defaultSortBy.order = OrderBy.ASC;
          this.defaultSortBy.sort = sortField;
        }
        break;
      case OrderBy.DESC:
        if(sortField == this.defaultSortBy.sort) {
          this.defaultSortBy.order = OrderBy.ASC;
        }
        else {
          this.defaultSortBy.order = OrderBy.ASC;
          this.defaultSortBy.sort = sortField;
        }
        break;
    }
    this.prepareGetAllArguments(false);
  }

  changePageSizeClicked(selectedPageSize: number): void {
    this.defaultPageLimit = selectedPageSize;
    this.currentPage = 1;
    this.prepareGetAllArguments(false);
  }
  
  changePageClicked(selectedPage: IPaginator): void {
    this.currentPage = selectedPage.pageIndex + 1;
    this.prepareGetAllArguments(false);
  }

  unlinkSubArgumentClicked(event: any, argument: ProcessArgument, subArgument: ProcessArgument) {
    
    event.stopPropagation();
    const dialogRef = this._dialog.open(DeleteComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.UNLINK_ARGUMENT,
        subTitle: MessageConstant.UNLINK_ARGUMENT_TXT,
        btnTxt: MessageConstant.DELETE,
        btnSubTxt: MessageConstant.CANCEL,
      },
    });
    dialogRef.afterClosed().subscribe((unlinkConfirmation: boolean) => {
      if(unlinkConfirmation) {
        let linkedArguments = argument.arguments;
        const findIndex = linkedArguments.findIndex(x => x._id === subArgument._id);
        if(findIndex > -1) {
          linkedArguments.splice(findIndex, 1);
          this.linkArguments(argument._id, linkedArguments);
        }
      }
    });
  }

  changeArgumentOrderClicked(parentArgumentId: string, linkedArguments: ProcessArgument[], argument: ProcessArgument, isMovingUp: boolean, event: any) {
    
    event.stopPropagation();
    if(isMovingUp && argument.order !== 1) {
      linkedArguments.forEach(arg => {
        if(arg.order == argument.order - 1) {
          arg.order = arg.order + 1;
        }
        else if(arg._id === argument._id && argument.order !== 1) {
          arg.order = arg.order - 1;
        }
      });
      this.linkArguments(parentArgumentId, linkedArguments);
    }
    else if(!isMovingUp && argument.order !== linkedArguments.length) {
      linkedArguments.forEach(arg => {
        if(arg._id === argument._id && argument.order !== linkedArguments.length) {
          arg.order = arg.order + 1;
        }
        else if(arg.order == argument.order) {
          arg.order = arg.order - 1;
        }
      });
      this.linkArguments(parentArgumentId, linkedArguments);
    }
  }

  openLinkArgumentsPopup(argumentId: string, alreadyLinkedarguments: ProcessArgument[]):void{
    const dialogRef = this._dialog.open(LinkArgumentComponent, {
      width: '935px',
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.LINK_ARGUMENTS,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
        component: ProcessUrlTab.ARGUMENT,
        isDisabled: false,
        data: {
          parentId: argumentId,
          alreadyLinkedArguments: Array.from(alreadyLinkedarguments),
          selectedEnvironment: this.selectedEnvironment
        }
      },
    });

    dialogRef.afterClosed().subscribe((linkedArguments: ProcessArgument[]) => {
      if(linkedArguments) {
        this.linkArguments(argumentId, linkedArguments);
      }
    });
  }

  openCreateArgumentPopup(): void {
    const dialogRef = this._dialog.open(CreateArgumentComponent, {
      width: '440px',
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.ADD_ARGUMENT,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
        component: ProcessUrlTab.ARGUMENT,
        isDisabled: false,
        data: {}
      },
    });

    dialogRef.afterClosed().subscribe((argument: ProcessArgument) => {
      if(argument) {
        this.createArgument(argument);
      }
    });
  }

  openEditArgumentPopup(argument: ProcessArgument, event: any): void {
    event.stopPropagation();
    const dialogRef = this._dialog.open(CreateArgumentComponent, {
      width: '440px',
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.EDIT_ARGUMENT,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
        component: ProcessUrlTab.ARGUMENT,
        isDisabled: false,
        data: argument
      },
    });
    dialogRef.afterClosed().subscribe((argument: ProcessArgument) => {
      if(argument) {
        argument.arguments = undefined;
        this.editArgument(argument);
      }
    });
  }

  openDeleteArgumentPopup(id: string, event: any): void {

    event.stopPropagation();
    const dialogRef = this._dialog.open(DeleteComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.DELETE_ARGUMENT,
        subTitle: MessageConstant.DELETE_ARGUMENT_TXT,
        btnTxt: MessageConstant.DELETE,
        btnSubTxt: MessageConstant.CANCEL,
      },
    });
    dialogRef.afterClosed().subscribe((deleteConfirmation: boolean) => {
      if(deleteConfirmation) {
        this.deleteArgument(id);
      }
    });
  }
}
