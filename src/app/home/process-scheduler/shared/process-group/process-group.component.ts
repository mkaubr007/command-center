import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CssConstant } from '../../../../core/constants/css.constant';
import { MessageConstant } from '../../../../core/constants/message.constant';
import { DeleteComponent } from '../../../../home/shared-home/components/delete/delete.component';
import { OrderBy, SortBy } from '../../../../shared/enums/cosa-nostra/process-group-sorting.enum';
import { ProcessUrlTab } from '../../../../shared/enums/teams-tab.enum';
import { Processes } from '../../../../shared/models/cosa-nostra/process.model';
import { Schedule } from '../../../../shared/models/cosa-nostra/schedule-process-group';
import { IErrorResponse } from '../../../../shared/models/error/error.interface';
import { IPaginator } from '../../../../shared/models/paginator/paginator.interface';
import { ProcessGroup } from '../../../../shared/models/processGroup/process-group-model';
import { IProcess, IProcessGroup, IProcessGroupProcesses, IProcessGroupResponseData, IProcessGroupResponses } from '../../../../shared/models/processGroup/process-group-service-rep';
import { ApiResponse } from '../../../../shared/models/util/api-response';
import { SharedService } from '../../../../shared/shared.service';
import { ProcessGroupService } from '../../services/process-group.service';
import { ProcessSharedService } from '../../services/process-shared.service';
import { CreateProcessGroupComponent } from '../create-process-group/create-process-group.component';
import { LinkProcessComponent } from '../link-process/link-process.component';
import { ScheduleProgressGroupComponent } from '../schedule-progress-group/schedule-progress-group.component';

@Component({
  selector: 'app-process-group',
  templateUrl: './process-group.component.html',
  styleUrls: ['./process-group.component.scss']
})
export class ProcessGroupComponent implements OnInit {

  @Output() totalProcessGroup = new EventEmitter<number>();
  @Output() updateSchedules = new EventEmitter<boolean>();
  public messageConstants = MessageConstant;
  public defaultPageLimit = 10;
  public currentPage = 1;
  public defaultSortBy: { sort: SortBy; order: OrderBy } = { sort: SortBy.NAMEPG, order: OrderBy.ASC };
  public sortByRef = SortBy;
  public orderByRef = OrderBy;
  public totalLength: number;
  public isDataLoading = false;
  public isSearch = false;
  public processGroups: IProcessGroup[] = [];
  public btnTitle = 'Create a new Process Group';
  public searchValue = '';
  public status = '';
  public selectedClient = '';
  public selectedEnvironment = '';

  private inputSubscription: Subscription;
  public clientSubscription: Subscription;
  public environmentSubscription: Subscription;

  constructor(public _dialog: MatDialog,
    private _sharedService: SharedService,
    private _processSharedService: ProcessSharedService,
    private _processGroupService: ProcessGroupService) { }

  ngOnInit(): void {
    this.isSearch = false;
    this.getCurrentFiltersSelection();
    this.subscribeToClientEnvironmentChange();
  }

  ngOnDestroy(): void {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
    if (this.environmentSubscription) {
      this.environmentSubscription.unsubscribe();
    }
  }

  private getCurrentFiltersSelection() {
    const currentSelection = this._processSharedService.selectedClientEnvironment.value;
    if(currentSelection && currentSelection.client && currentSelection.environment && currentSelection.client !== '' && currentSelection.environment !== '') {
      this.selectedClient = currentSelection.client;
      this.selectedEnvironment = currentSelection.environment;
    }
  }

  private subscribeToClientEnvironmentChange(): void {
    this.environmentSubscription = this._processSharedService.getSelectedClientEnvironment().subscribe((value) => {
      if(value && value.environment) {
        this.selectedClient = value.client;
        this.selectedEnvironment = value.environment;
        this.prepareGetProcessGroups(true);
      }
    });
  }

  public getSearchInputValue(): void {
    this.isSearch = true;
    this.getProcessGroups();
  }

  private prepareGetProcessGroups(isDataLoading: boolean) {
    this.isDataLoading = isDataLoading;
    this.getProcessGroups();
  }

  public getProcessGroups(): void {
    this._sharedService.startBlockUI();
    this._processGroupService
      .getProcessGroup(
        this.selectedClient,
        this.selectedEnvironment,
        this.defaultSortBy.sort,
        this.defaultSortBy.order,
        this.defaultPageLimit,
        this.currentPage,
        this.searchValue,
        this.status
      )
      .subscribe(
        (response: IProcessGroupResponseData) => {
          this.setProcessGroup(response);
        },
        (error: IErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  public getProcessStatus(processes: IProcessGroupProcesses[], processId: string): string {
    return processes.find(x => x.id == processId)?.status;
  }

  public setProcessGroup(response: IProcessGroupResponseData): void {
    this.processGroups = response.result;
    this.totalLength = response.count;
    this.totalProcessGroup.emit(this.totalLength);
    this._sharedService.stopBlockUI();
    this.isDataLoading = false;
  }


  private createProcessGroup(processGroup: ProcessGroup) {
    this._processGroupService.createNewProcessGroup(this.selectedClient, this.selectedEnvironment, processGroup)
      .subscribe(
        (response: ApiResponse<ProcessGroup>) => {
          if (response) {
            this.prepareGetProcessGroups(true);
            this._sharedService.openSuccessSnackBar(response);
          }
          else {
            this._sharedService.openErrorSnackBar(MessageConstant.PROCESS_GROUPS_TAB_ERROR);
          }
        },
        (error) => {
          this._sharedService.openErrorSnackBar(error);
        }
      );
  }

  private editProcessGroup(processGroup: ProcessGroup) {
    this._processGroupService.updateProcessGroup(processGroup._id, processGroup)
      .subscribe(
        (response: ApiResponse<ProcessGroup>) => {
          if (response) {
            this.prepareGetProcessGroups(true);
            this._sharedService.openSuccessSnackBar(response);
          }
          else {
            this._sharedService.openErrorSnackBar(MessageConstant.PROCESS_GROUPS_TAB_ERROR);
          }
        },
        (error) => {
          this._sharedService.openErrorSnackBar(error);
        }
      );
  }

  private linkProcesses(processGroupId: string, linkedProcesses: Processes[]) {
    if (linkedProcesses) {
      const mappedProcesses = linkedProcesses.map((x) => x._id);
      this._processGroupService.linkProcesses(processGroupId, mappedProcesses)
        .subscribe(
          (response: ApiResponse<IProcessGroupResponses>) => {
            if (response) {
              this.prepareGetProcessGroups(true);
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

  private deleteProcessGroup(id: string) {
    this._processGroupService.deleteProcessGroup(id)
      .subscribe(
        (response: ApiResponse<ProcessGroup>) => {
          if (response.statusCode == 200) {
            this.prepareGetProcessGroups(true);
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

  private publishUnpublishProcessGroup(processGroup: ProcessGroup) {
    this._processGroupService.publishUnpublishProcessGroup(processGroup._id, processGroup.isPublished)
      .subscribe(
        (response: ApiResponse<IProcessGroupResponses>) => {
          if (response.statusCode == 200) {
            this._sharedService.openSuccessSnackBar(response);
          }
          else {
            this._sharedService.openErrorSnackBar(MessageConstant.PROCESS_TAB_ERROR);
            processGroup.isPublished = !processGroup.isPublished;
          }
        },
        (error) => {
          this._sharedService.openErrorSnackBar(error);
          processGroup.isPublished = !processGroup.isPublished;
        }
      );
  }

  private enableDisableProcess(processGroupId: string, processId: string, isEnabled: boolean) {
    this._processGroupService.enableDisableProcess(processGroupId, processId, isEnabled)
      .subscribe(
        () => { },
        (error: IErrorResponse) => {
          this.handleError(error);
          this.isDataLoading = false;
        }
      );
  }

  sortDataClicked(sortField: SortBy) {
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
    this.prepareGetProcessGroups(false);
  }

  public handleError(error: IErrorResponse): void {
    this.isDataLoading = true;
    this._sharedService.openErrorSnackBar(error);
    this._sharedService.stopBlockUI();
  }

  public onClear(event): void {
    this.isSearch = false;
    this.searchValue = '';
    this.prepareGetProcessGroups(true);
  }

  public changePageClicked(event: IPaginator): void {
    this.currentPage = event.pageIndex + 1;
    this.getPaginatedData(this.defaultPageLimit, this.currentPage);
  }
  public changePageSizeClicked(event: number): void {
    this.defaultPageLimit = event;
    this.currentPage = 1;
    this.getPaginatedData(event, this.currentPage);
  }
  public getPaginatedData(limit: number, currentPage: number): void {
    this._sharedService.startBlockUI();

    this._processGroupService.getProcessGroup(this.selectedClient, this.selectedEnvironment, this.defaultSortBy.sort, this.defaultSortBy.order, limit, currentPage)
      .subscribe((response: IProcessGroupResponseData) => {
        this.setProcessGroup(response);
      });
  }

  public openPublishPopUp(processGroup: ProcessGroup, event: any) {
    const dialogRef = this._dialog.open(DeleteComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: processGroup.isPublished ? MessageConstant.PUBLISH_PROCESS_GROUP : MessageConstant.UNPUBLISH_PROCESS_GROUP,
        subTitle: processGroup.isPublished ? MessageConstant.PUBLISH_PROCESS_GROUP_TXT : MessageConstant.UNPUBLISH_PROCESS_GROUP_TXT,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
      },
    });

    dialogRef.afterClosed().subscribe((confirmation: boolean) => {
      if (confirmation) {
        this.publishUnpublishProcessGroup(processGroup);
      }
      else {
        processGroup.isPublished = !processGroup.isPublished;
      }
    });
  }

  public enableOnChangeClicked(processGroupId: string, processId: string, isEnabled: boolean, event: any) {
    this.enableDisableProcess(processGroupId, processId, isEnabled)
  }

  unlinkProcessClicked(event: any, processGroup: ProcessGroup, process: Processes) {

    event.stopPropagation();
    const dialogRef = this._dialog.open(DeleteComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.UNLINK_PROCESS_GROUP,
        subTitle: MessageConstant.UNLINK_PROCESS_GROUP_TXT,
        btnTxt: MessageConstant.DELETE,
        btnSubTxt: MessageConstant.CANCEL,
      },
    });
    dialogRef.afterClosed().subscribe((unlinkConfirmation: boolean) => {
      if (unlinkConfirmation) {
        let linkedProcesses = processGroup.processDetails;
        const findIndex = linkedProcesses.findIndex(x => x._id === process._id);
        if (findIndex > -1) {
          linkedProcesses.splice(findIndex, 1);
          this.linkProcesses(processGroup._id, linkedProcesses);
        }
      }
    });
  }

  public createScheduleProcessGroupPopup(processGroup: ProcessGroup, event: any) {
    event.stopPropagation();
    if(!processGroup.isPublished){
      return;
    }
    const dialogRef = this._dialog.open(ScheduleProgressGroupComponent, {
      width: '440px',
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.ADD_NEW_TEAM_MEMBERS,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
        component: ProcessUrlTab.PROCESS,
        isDisabled: false,
        data: {
          processGroupId: processGroup._id,
          client: processGroup.client,
          environment: processGroup.environment
        }
      },
    });

    dialogRef.afterClosed().subscribe((schedule: Schedule) => {
      if (schedule) {
        this.updateSchedules.emit(true);
        this.getProcessGroups();
      }
    });
  }

  public openCreateProcessGroupPopup(processGroup?: IProcessGroup): void {

    const dialogRef = this._dialog.open(CreateProcessGroupComponent, {
      width: '440px',
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.ADD_NEW_PROCESS_GROUP,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
        component: ProcessUrlTab.PROCESS_GROUP,
        isDisabled: false,
        data: {}
      },
    });

    dialogRef.afterClosed().subscribe((processGroup: ProcessGroup) => {
      if (processGroup) {
        this.createProcessGroup(processGroup);
      }
    });
  }


  public openEditProcessGroupPopup(processgroup: IProcessGroup, event: any): void {
    event.stopPropagation();
    const dialogRef = this._dialog.open(CreateProcessGroupComponent, {
      width: '440px',
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.EDIT_PROCESS_GROUP,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
        component: ProcessUrlTab.PROCESS_GROUP,
        isDisabled: false,
        data: processgroup
      },
    });

    dialogRef.afterClosed().subscribe((processGroup: ProcessGroup) => {
      if (processGroup) {
        this.editProcessGroup(processGroup);
      }
    });
  }

  openLinkProcessesPopup(id: string, alreadyLinkedProcesses: IProcess[]): void {
    const dialogRef = this._dialog.open(LinkProcessComponent, {
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
          processGroupId: id,
          alreadyLinkedProcesses: Array.from(alreadyLinkedProcesses),
          selectedEnvironment: this.selectedEnvironment
        }
      },
    });

    dialogRef.afterClosed().subscribe((linkedProcesses: Processes[]) => {
      if (linkedProcesses) {
        this.linkProcesses(id, linkedProcesses);
      }
    });
  }

  openDeleteProcessGroupPopup(id: string, event: any): void {

    event.stopPropagation();
    const dialogRef = this._dialog.open(DeleteComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.DELETE_PROCESS_GROUP,
        subTitle: MessageConstant.DELETE_PROCESS_GROUP_TXT,
        btnTxt: MessageConstant.DELETE,
        btnSubTxt: MessageConstant.CANCEL,
      },
    });
    dialogRef.afterClosed().subscribe((deleteConfirmation: boolean) => {
      if (deleteConfirmation) {
        this.deleteProcessGroup(id);
      }
    });
  }

}


