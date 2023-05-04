import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs/internal/Subscription';
import { CssConstant } from '../../../../core/constants/css.constant';
import { MessageConstant } from '../../../../core/constants/message.constant';
import { DeleteComponent } from '../../../shared-home/components/delete/delete.component';
import { ProcessUrlTab } from '../../../../shared/enums/teams-tab.enum';
import { IScheduleProcessGroupResponse, Schedule, ScheduleProcessGroup } from '../../../../shared/models/cosa-nostra/schedule-process-group';
import { IErrorResponse } from '../../../../shared/models/error/error.interface';
import { IPaginator } from '../../../../shared/models/paginator/paginator.interface';
import { SharedService } from '../../../../shared/shared.service';
import { ProcessSharedService } from '../../services/process-shared.service';
import { ScheduleProcessGroupService } from '../../services/schedule-process-group.service';
import { ScheduleProgressGroupComponent } from '../schedule-progress-group/schedule-progress-group.component';
import { ApiResponse } from '../../../../shared/models/util/api-response';
import { OrderBy, SortBy } from '../../../../shared/enums/cosa-nostra/schedule-sorting.enum';


@Component({
  selector: 'app-manage-process-group',
  templateUrl: './manage-process-group.component.html',
  styleUrls: ['./manage-process-group.component.scss']
})
export class ManageProcessGroupComponent implements OnInit {

  public searchValue = '';
  public totalCount = 0;
  public placeholderText: string = 'Search Schedules';
  public selectedTabIndex: number = 0;
  public selectedClient = '';
  public selectedEnvironment = '';


  public messageConstants = MessageConstant;
  public defaultPageLimit = 10;
  public currentPage = 1;
  public defaultSortBy: { sort: SortBy; order: OrderBy } = { sort: SortBy.NEXT_SCHEDULED_DATE, order: OrderBy.ASC };
  public sortByRef = SortBy;
  public orderByRef = OrderBy;
  public totalLength: number = 0;
  public isDataLoading = false;
  public isSearch = false;
  public btnTitle = MessageConstant.PROCESS_GROUP_CREATE_TXT;
  public status = '';
  public clientEnvironmentSubscription: Subscription;


  public scheduledProcessGroup: ScheduleProcessGroup;

  constructor(public _dialog: MatDialog,
    private _sharedService: SharedService,
    private _processSharedService: ProcessSharedService,
    private _scheduleProcessGroupService: ScheduleProcessGroupService) { }


  ngOnInit(): void {
    this.isSearch = false;
    this.getCurrentFiltersSelection();
    this.subscribeToClientEnvironmentChange();
  }

  public getScheduledProcessGroup(): void {
    this._sharedService.startBlockUI();
    this._scheduleProcessGroupService
      .getClientSchedules(
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
        (response: IScheduleProcessGroupResponse) => {
          this.setProcessGroup(response);
        },
        (error: IErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  private getCurrentFiltersSelection() {
    const currentSelection = this._processSharedService.selectedClientEnvironment.value;
    if(currentSelection && currentSelection.environment && currentSelection.environment !== '') {
      this.selectedClient = currentSelection.client;
      this.selectedEnvironment = currentSelection.environment;
    }
  }

  private subscribeToClientEnvironmentChange(): void {
    this.clientEnvironmentSubscription = this._processSharedService.getSelectedClientEnvironment().subscribe((value) => {
      if (value && value.environment) {
        this.selectedClient = value.client;
        this.selectedEnvironment = value.environment;
        this.prepareGetProcessGroups(true);
      }
    });
  }

  private prepareGetProcessGroups(isDataLoading: boolean) {
    this.isDataLoading = isDataLoading;
    this.getScheduledProcessGroup();
  }

  public handleError(error: IErrorResponse): void {
    this.isDataLoading = false;
    this._sharedService.openErrorSnackBar(error);
    this._sharedService.stopBlockUI();
  }

  public onTabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedTabIndex = tabChangeEvent.index;
  }

  public updateTotalProcessGroup(count: number) {
    this.totalCount = count;
  }

  openDeleteProcessPopup(clientScheduleId: string, scheduleId: string, event: any): void {
    event.stopPropagation();
    const dialogRef = this._dialog.open(DeleteComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.DELETE_SCHEDULE_PROCESS_GROUP,
        subTitle: MessageConstant.DELETE_SCHEDULE_PROCESS_GROUP_TXT,
        btnTxt: MessageConstant.DELETE,
        btnSubTxt: MessageConstant.CANCEL,
      },
    });

    dialogRef.afterClosed().subscribe((deleteConfirmation: boolean) => {
      if (deleteConfirmation) {
        this.deleteScheduledProcessGroup(clientScheduleId, scheduleId);
      }
    });
  }

  private deleteScheduledProcessGroup(clientScheduleId: string, scheduleId: string) {
    this._scheduleProcessGroupService.deleteScheduledProcessGroup(clientScheduleId, scheduleId)
      .subscribe(
        (response: ApiResponse<Boolean>) => {
           if(response.statusCode == 200){
            this.getScheduledProcessGroup();
            this._sharedService.openSuccessSnackBar(response);
          }
          else {
            this._sharedService.openErrorSnackBar(MessageConstant.SCHEDULE_TAB_ERROR);
          }
        },
        (error) => {
          this._sharedService.openErrorSnackBar(error);
        }
      );
  }

  public setProcessGroup(response: IScheduleProcessGroupResponse): void {
    this.scheduledProcessGroup = response.result;
    this.totalLength = response.count;
    this._sharedService.stopBlockUI();
    this.isDataLoading = false;
  }

  public editProcessGroupClicked(clientScheduleId: string, schedule: Schedule): void {
    this.openProcessGroupSchedulePopup(clientScheduleId, schedule);
  }

  public openProcessGroupSchedulePopup(clientScheduleId: string, schedule: Schedule): void {

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
          clientScheduleId: clientScheduleId,
          schedule: Object.assign({},schedule)
        }
      },
    });

    dialogRef.afterClosed().subscribe((updatedSchedule: Schedule) => {
      if (updatedSchedule) {
        schedule.cronExpression = updatedSchedule.cronExpression;
        schedule.scheduleType = updatedSchedule.scheduleType;
        this.getScheduledProcessGroup();
      }
    });
  }

  public getSearchInputValue() {
    this.isSearch = true;
    this.getScheduledProcessGroup();
  }

  public onChange(event) {

  }

  public onClear(event): void {
    this.isSearch = false;
    this.searchValue = '';
    this.getScheduledProcessGroup();
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

    this._scheduleProcessGroupService.getClientSchedules(this.selectedClient, this.selectedEnvironment, this.defaultSortBy.sort, this.defaultSortBy.order, limit, currentPage)
      .subscribe(
        (response: IScheduleProcessGroupResponse) => {
          this.setProcessGroup(response);
        },
        (error: IErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  public enableOnChangeClicked(clientScheduleId: string, schedule: Schedule) {
      const dialogRef = this._dialog.open(DeleteComponent, {
        width: CssConstant.POPUP_WIDTH,
        disableClose: true,
        scrollStrategy: new NoopScrollStrategy(),
        data: {
          title: schedule.isEnabled ? MessageConstant.ENABLE_SCHEDULE: MessageConstant.DISABLE_SCHEDULE,
          subTitle:  schedule.isEnabled ? MessageConstant.ENABLE_SCHEDULE_TXT : MessageConstant.DISABLE_SCHEDULE_TXT,
          btnTxt: MessageConstant.SAVE,
          btnSubTxt: MessageConstant.CANCEL,
        },
      });
  
      dialogRef.afterClosed().subscribe((confirmation: boolean) => {
        if (confirmation) {
          this._scheduleProcessGroupService.enableDisableSchedule(clientScheduleId, schedule._id, schedule.isEnabled)
          .subscribe(
            (response) => {
              this._sharedService.openSuccessSnackBar(response);
             },
            (error: IErrorResponse) => {
              schedule.isEnabled = !schedule.isEnabled;
              this.handleError(error);
            }
          );
        }
        else {
          schedule.isEnabled = !schedule.isEnabled;
        }
      });
  }

  public updateSchedulesData(isRefresh : Boolean){
    if(isRefresh){
      this.getScheduledProcessGroup();
    }
  }

  ngOnDestroy(): void {
    if(this.clientEnvironmentSubscription) {
      this.clientEnvironmentSubscription.unsubscribe();
    }
  }
}
