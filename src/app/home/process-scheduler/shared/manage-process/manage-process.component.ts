import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CssConstant } from '../../../../core/constants/css.constant';
import { MessageConstant } from '../../../../core/constants/message.constant';
import { DeleteComponent } from '../../../../home/shared-home/components/delete/delete.component';
import { OrderBy, SortBy } from '../../../../shared/enums/cosa-nostra/process-sorting.enum';
import { ProcessUrlTab } from '../../../../shared/enums/teams-tab.enum';
import { IPaginator } from '../../../../shared/models/paginator/paginator.interface';
import { Processes, ProcessParams } from '../../../../shared/models/cosa-nostra/process.model';
import { SharedService } from '../../../../shared/shared.service';
import { ProcessSharedService } from '../../services/process-shared.service';
import { ProcessService } from '../../services/process.service';
import { CreateProcessComponent } from '../create-process/create-process.component';
import { LinkArgumentComponent } from '../link-argument/link-argument.component';
import { ApiResponse } from '../../../../shared/models/util/api-response';
import { ProcessArgument } from '../../../../shared/models/cosa-nostra/process-arguments.model';

@Component({
  selector: 'app-manage-process',
  templateUrl: './manage-process.component.html',
  styleUrls: ['./manage-process.component.scss']
})
export class ManageProcessComponent implements OnInit {
  public messageConstants = MessageConstant;

  public defaultPageLimit = 10;
  public currentPage = 1;
  public defaultSortBy: { sort: SortBy; order: OrderBy } = { sort: SortBy.NAME, order: OrderBy.ASC };
  public sortByRef = SortBy;
  public orderByRef = OrderBy;
  public totalLength: number;
  public isDataLoading = false;
  public isSearch = false;
  public selectedEnvironment = '';
  public processList = [];
  public searchSubscription: Subscription;
  public environmentSubscription: Subscription;

  constructor(public _dialog: MatDialog,
    public _processService: ProcessService,
    private _sharedService: SharedService,
    private _processSharedService: ProcessSharedService) { }


  ngOnInit(): void {
    this.isSearch = false;
    this.getCurrentFiltersSelection();
    this.subscribeToProcessSearch();
    this.subscribeToEnvironmentChange();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
      this.environmentSubscription.unsubscribe();
    }
  }

  private getCurrentFiltersSelection() {
    const currentSelection = this._processSharedService.selectedClientEnvironment.value;
    if(currentSelection && currentSelection.environment && currentSelection.environment !== '') {
      this.selectedEnvironment = currentSelection.environment;
    }
  }

  private subscribeToProcessSearch(): void {
    this.searchSubscription = this._processService.getSearchValue().subscribe((value) => {
      this.searchProcesses(value);
    });
  }

  private subscribeToEnvironmentChange(): void {
    this.environmentSubscription = this._processSharedService.getSelectedClientEnvironment().subscribe((value) => {
      if(value && value.environment) {
        this.selectedEnvironment = value.environment;
        this.prepareGetAllProcesses(true);
      }
    });
  }

  private searchProcesses(searchKeyword: string) {
    this.getAllProcesses(this.selectedEnvironment, searchKeyword, this.defaultSortBy.sort, this.defaultSortBy.order, this.defaultPageLimit, this.currentPage);
  }


  private prepareGetAllProcesses(isDataLoading: boolean) {
    this.isDataLoading = isDataLoading;
    this.getAllProcesses(this.selectedEnvironment, '', this.defaultSortBy.sort, this.defaultSortBy.order, this.defaultPageLimit, this.currentPage);
  }

  private getAllProcesses(environment: string, searchKeyword: string, sortBy: SortBy, orderBy: OrderBy, limit: number, page: number) {
    this._sharedService.startBlockUI();
    this.isSearch = (searchKeyword && searchKeyword !== '');
    this._processService.getAllProcesses(environment, searchKeyword, sortBy, orderBy, limit, page)
      .subscribe(
        (response: ProcessParams) => {
          this.setProcessList(response);
          console.log(response)
        },
        (error) => {
          this._sharedService.openErrorSnackBar(error);
        }
      );
  }

  private setProcessList(response: ProcessParams) {
    this.processList = response.result;
    this.totalLength = response.count;
    this._sharedService.stopBlockUI();
    this.isDataLoading = false;
  }

  getOrderedSubArguments(subArguments: ProcessArgument[]) {
    return subArguments.sort((a,b) => a.order?.toString().localeCompare(b.order?.toString()));
  }

  changeArgumentOrderClicked(processId: string, linkedArguments: ProcessArgument[], argument: ProcessArgument, isMovingUp: boolean, event: any) {
    
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
      this.linkArguments(processId, linkedArguments);
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
      this.linkArguments(processId, linkedArguments);
    }
  }

  openLinkArgumentsPopup(processId: string, alreadyLinkedarguments: ProcessArgument[]): void {

    const dialogRef = this._dialog.open(LinkArgumentComponent, {
      width: '935px',
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.LINK_ARGUMENTS,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
        component: ProcessUrlTab.PROCESS,
        isDisabled: false,
        data: {
          parentId: processId,
          alreadyLinkedArguments: Array.from(alreadyLinkedarguments),
          selectedEnvironment: this.selectedEnvironment
        }
      },
    });

    dialogRef.afterClosed().subscribe((linkedArguments: ProcessArgument[]) => {
      if (linkedArguments) {
        this.linkArguments(processId, linkedArguments);
      }
    });
  }

  openPublishPopUp(process: Processes, event: any) {

    event.stopPropagation();
    const dialogRef = this._dialog.open(DeleteComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: process.isPublished ? MessageConstant.PUBLISH_PROCESS : MessageConstant.UNPUBLISH_PROCESS,
        subTitle: process.isPublished ? MessageConstant.PUBLISH_PROCESS_TXT : MessageConstant.UNPUBLISH_PROCESS_TXT,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
      },
    });

    dialogRef.afterClosed().subscribe((confirmation: boolean) => {
      if (confirmation) {
        this.publishUnpublishProcess(process._id, process);
      }
      else {
        process.isPublished = !process.isPublished;
      }
    });
  }

  private publishUnpublishProcess(id: string, process: Processes) {

    this._processService.publishUnpublishProcess(id, process.isPublished)
      .subscribe(
        (response: ApiResponse<Processes>) => {
          if (response.statusCode == 200) {
            this.prepareGetAllProcesses(true);
            this._sharedService.openSuccessSnackBar(response);
          }
          else {
            this._sharedService.openErrorSnackBar(MessageConstant.PROCESS_TAB_ERROR);
            process.isPublished = !process.isPublished;
          }
        },
        (error) => {
          this._sharedService.openErrorSnackBar(error);
          process.isPublished = !process.isPublished;
        }
      );
  }

  linkArguments(processId: string, linkedArguments: ProcessArgument[]) {

    if (linkedArguments) {
      const mappedLinkedArguments = linkedArguments.map((x) => {
        return {
          id: x._id,
          overrideValue: null,
          order: x.order
        }
      });
      this._processService.linkArguments(processId, mappedLinkedArguments)
        .subscribe(
          (response: ApiResponse<ProcessArgument>) => {
            if (response) {
              this.prepareGetAllProcesses(true);
              this._sharedService.openSuccessSnackBar(response);
            }
            else {
              this._sharedService.openErrorSnackBar(MessageConstant.PROCESS_TAB_ERROR);
            }
          },
          (error) => {
            this._sharedService.openErrorSnackBar(error);
          }
        );
    }
  }

  unlinkArgumentClicked(event: any, process: Processes, argument: ProcessArgument) {

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
      if (unlinkConfirmation) {
        let linkedArguments = process.arguments.argumentValuesDetails
        const findIndex = linkedArguments.findIndex(x => x._id === argument._id);
        if (findIndex > -1) {
          linkedArguments.splice(findIndex, 1);
          this.linkArguments(process._id, linkedArguments);
        }
      }
    });
  }

  public createProcessClicked(event: boolean): void {
    if (event) {
      this.openCreateProcessPopup();
    }
  }

  public openCreateProcessPopup(): void {
    const dialogRef = this._dialog.open(CreateProcessComponent, {
      width: '440px',
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.CREATE_NEW_PROCESS,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
        component: ProcessUrlTab.PROCESS,
        isDisabled: false,
        data: {}
      },
    });

    dialogRef.afterClosed().subscribe((process: Processes) => {
      if (process) {
        this.createProcess(process);
      }
    });

  }

  private createProcess(process: Processes) {
    this._processService.createProcess(this.selectedEnvironment, process)
      .subscribe(
        (response: ApiResponse<Processes>) => {
          if (response) {
            this.prepareGetAllProcesses(true);
            this._sharedService.openSuccessSnackBar(response);
          }
          else {
            this._sharedService.openErrorSnackBar(MessageConstant.PROCESS_TAB_ERROR);
          }
        },
        (error) => {
          this._sharedService.openErrorSnackBar(error);
        }
      );
  }

  openDeleteProcessPopup(id: string, event: any): void {
    event.stopPropagation();
    const dialogRef = this._dialog.open(DeleteComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.DELETE_PROCESS,
        subTitle: MessageConstant.DELETE_PROCESS_TXT,
        btnTxt: MessageConstant.DELETE,
        btnSubTxt: MessageConstant.CANCEL,
      },
    });

    dialogRef.afterClosed().subscribe((deleteConfirmation: boolean) => {
      if (deleteConfirmation) {
        this.deleteProcess(id);
      }
    });
  }

  private deleteProcess(id: string) {
    this._processService.deleteProcess(id)
      .subscribe(
        (response: ApiResponse<Processes>) => {
          if (response.statusCode == 200) {
            this.prepareGetAllProcesses(true);
            this._sharedService.openSuccessSnackBar(response);
          }
          else {
            this._sharedService.openErrorSnackBar(MessageConstant.PROCESS_TAB_ERROR);
          }
        },
        (error) => {
          this._sharedService.openErrorSnackBar(error);
        }
      );
  }

  public openEditProcessPopup(process: Processes, event: any): void {

    event.stopPropagation();
    const dialogRef = this._dialog.open(CreateProcessComponent, {
      width: '440px',
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.EDIT_PROCESS,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
        component: ProcessUrlTab.PROCESS,
        isDisabled: false,
        data: process
      },
    });

    dialogRef.afterClosed().subscribe((process: Processes) => {
      if (process) {
        // process.arguments = undefined;
        this.editProcess(process);
      }
    });
  }

  private editProcess(process: Processes) {
    this._processService.editProcess(this.selectedEnvironment, process)
      .subscribe(
        (response: ApiResponse<Processes>) => {
          if (response) {
            this.prepareGetAllProcesses(true);
            this._sharedService.openSuccessSnackBar(response);
          }
          else {
            this._sharedService.openErrorSnackBar(MessageConstant.PROCESS_TAB_ERROR);
          }
        },
        (error) => {
          this._sharedService.openErrorSnackBar(error);
        }
      );
  }

  changeSortOrderClicked(sortField: SortBy) {
    switch (this.defaultSortBy.order) {
      case OrderBy.ASC:
        if (sortField == this.defaultSortBy.sort) {
          this.defaultSortBy.order = OrderBy.DESC;
        }
        else {
          this.defaultSortBy.order = OrderBy.ASC;
          this.defaultSortBy.sort = sortField;
        }
        break;
      case OrderBy.DESC:
        if (sortField == this.defaultSortBy.sort) {
          this.defaultSortBy.order = OrderBy.ASC;
        }
        else {
          this.defaultSortBy.order = OrderBy.ASC;
          this.defaultSortBy.sort = sortField;
        }
        break;
    }
    this.prepareGetAllProcesses(false);
  }

  changePageSizeClicked(selectedPageSize: number): void {
    this.defaultPageLimit = selectedPageSize;
    this.currentPage = 1;
    this.prepareGetAllProcesses(false);
  }

  changePageClicked(selectedPage: IPaginator): void {
    this.currentPage = selectedPage.pageIndex + 1;
    this.prepareGetAllProcesses(false);
  }

}
