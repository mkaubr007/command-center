import { ApiResponse } from './../../../../shared/models/util/api-response';
import { AuthService } from './../../../../auth/auth.service';
import { cloneDeep } from 'lodash';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageConstants } from './../../../../core/constants/local-storage.constants';
import { CssConstant } from './../../../../core/constants/css.constant';
import { JiraConstants } from './../../../../core/constants/jira.constant';
import { MessageConstant } from './../../../../core/constants/message.constant';
import { StatusCodeConstant } from './../../../../core/constants/status-code.constant';
import { LocalStorageService } from './../../../../core/services/local-storage.service';
import { RouteConstants } from './../../../../core/constants/route.constants';
import { JiraService } from './../../../../shared/services/jira.service';
import { EmptyErrorsTableHeader, ErrorsTableHeader, ErrorUrlTab } from '../../../../shared/enums/error-tab.enum';
import { IErrorDetail, IErrorDetailResponse, IErrorDetailResponseData, IJiraState } from '../../../../shared/models/error-detail/error-detail.interface';
import { IStatus } from '../../../../shared/models/status/status.interface';
import { SharedService } from '../../../../shared/shared.service';
import { StatusService } from '../../../../shared/services/status.service';
import { ISorting } from '../../../../shared/models/sorting/sorting.interface';
import { IErrorResponse } from '../../../../shared/models/error/error.interface';
import { ErrorService } from '../components/errors-tab/error.service';
import { OrderBy, SortBy, Sorting } from '../components/errors-tab/shared/enum/errors.enum';
import { ErrorConstants } from '../components/errors-tab/shared/constants/error.constants';
import { CreateEditJiraTicketComponent } from '../components/create-edit-jira-ticket/create-edit-jira-ticket.component';
import { Subscription } from 'rxjs';
import { IDashboardSearchFilters } from '../../../../shared/models/dashboard/dashboard-search-filters.interface';
import { DashboardService } from '../../dashboard.service';
import { HomeDropdownConstants } from '../../../shared-home/components/home-dropdown/home-dropdown.constants';
import { SelectionModel } from '@angular/cdk/collections';
import { TeamMemberStatus } from '../../../../shared/enums/teams-tab.enum';
import { NotificationSource } from 'src/app/shared/enums/notification.enum';

@Component({
  selector: 'app-errors-table',
  templateUrl: './errors-table.component.html',
  styleUrls: ['./errors-table.component.scss']
})
export class ErrorsTableComponent implements OnInit, OnDestroy {
  public readonly imageUrl = RouteConstants.NO_USER_IMAGE_PATH;
  public readonly ERROR_IMAGE_PATH = '../../../assets/images/errors/error.svg';
  public readonly MESSAGE_CONSTANT = MessageConstant;
  public readonly ERROR_CONSTANT = ErrorConstants;
  public oldErrorStatus: string;
  public teamMemberStatus = TeamMemberStatus;

  public emptyTableHeader = [
    { label: EmptyErrorsTableHeader.ERROR_TYPE, sort: true, checkbox: true },
    { label: EmptyErrorsTableHeader.DESCRIPTION, sort: false },
    { label: EmptyErrorsTableHeader.SERVICE, sort: true },
    { label: EmptyErrorsTableHeader.GENERATED_ON, sort: true },
    { label: EmptyErrorsTableHeader.ASSIGNEE, sort: false },
    { label: EmptyErrorsTableHeader.STATUS, sort: false }
  ];

  public displayedColumns: ErrorsTableHeader[] = [
    ErrorsTableHeader.ERROR_TYPE,
    ErrorsTableHeader.DESCRIPTION,
    ErrorsTableHeader.SERVICE,
    ErrorsTableHeader.GENERATED_ON,
    ErrorsTableHeader.ASSIGNEE,
    ErrorsTableHeader.STATUS,
  ];

  private activeErrorStatuses = [
    this.ERROR_CONSTANT.ERROR_STATUS.PENDING,
    this.ERROR_CONSTANT.ERROR_STATUS.IN_PROGRESS,
    this.ERROR_CONSTANT.ERROR_STATUS.CSR_ACTION,
  ];

  public dataSource: MatTableDataSource<IErrorDetail> = new MatTableDataSource<IErrorDetail>();
  public errorsTableHeader = ErrorsTableHeader;

  public sortBy = SortBy.GENERATED_ON;
  public orderBy = OrderBy.DESC;

  public totalLength = 0;
  public pageSize = 6;
  public currentPage = 1;

  public isSortingApplied: ErrorsTableHeader = ErrorsTableHeader.GENERATED_ON;
  public defaultSortingOrder: Sorting = Sorting.DESC;
  public sortingOrderRef = Sorting;

  public jiraBaseURL = ErrorConstants.BASE_URL;
  public ErrorUrlTab = ErrorUrlTab;

  public status: IStatus[];

  public errorsTableDataCopy: IErrorDetail[];
  public errorsTableData: IErrorDetail[];
  public selectedBulkUpdateErrors = new SelectionModel<string>(true, []);
  public isBulkAssigneeSelected = false;
  public showCheckboxes = true;
  public bulkUpdateAssignee = { id: "", name: "", avatar: "" };
  public isBulkUpdateAssigneeLoading = false;
  public isDataLoading = false;
  public paginatorText: string;
  private dashboardFilters$: Subscription;

  private errorType$: Subscription;

  @Input() showCreateJiraButton: boolean;
  @Input() fromTab: ErrorUrlTab;
  @Input() isAssigneeDisabled: boolean;
  @Input() isStatusDisabled: boolean;
  @Input() disabled: boolean;
  @Input() totalCount: number;

  @Input() jiraTicketState: any;
  @Output() jiraTicketStateChange: EventEmitter<string> = new EventEmitter();
  @Output() updateBadge: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _sharedService: SharedService,
    private _statusService: StatusService,
    private _jiraService: JiraService,
    public _dialog: MatDialog,
    public errorService: ErrorService,
    private localStorageService: LocalStorageService,
    private _authService: AuthService,
    private _dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    this.setDashboardParamsSubscription();
    this.showCheckboxes = [ErrorUrlTab.ALL, ErrorUrlTab.NEW, ErrorUrlTab.UNRESOLVED_MANUAL].includes(this.fromTab);
    if (!this.disabled) {
      this.setHeadersAndColumns();
      this.getStatuses();

      this.isDataLoading = true;
      this.errorsTableData = [];

      if (this.jiraTicketState) {
        this.pageSize = +this.jiraTicketState.limit;
        this.currentPage = +this.jiraTicketState.page;
      }

      this.errorType$ = this.errorService
        .errorTypeKeyChange()
        .subscribe((doRefresh) => {
          if (doRefresh) {
            this.getErrors();
          }
        });
    }
  }

  public getSearchParams(): { sortBy: SortBy, orderBy: OrderBy, limit: number, page: number, match: any, searchBy: string } {
    return {
      sortBy: this.sortBy,
      orderBy: this.orderBy,
      limit: this.pageSize,
      page: this.currentPage,
      match: this.errorService.getErrorMatchCriteria(this.fromTab),
      searchBy: this.errorService.getErrorTypeSearch()
    };
  }

  public async getErrors(): Promise<void> {
    this._sharedService.startBlockUI();

    try {
      const { sortBy, orderBy, limit, page, match, searchBy } = this.getSearchParams();
      const errorKey = Object.keys(ErrorUrlTab).find(error => ErrorUrlTab[error] === this.fromTab);
      const errorList = await this.errorService.getErrors(sortBy, orderBy, limit, page, match, searchBy, errorKey).toPromise();

      if (errorList) {
        this.setErrors(errorList);
      } else {
        this.isDataLoading = false;
        this._sharedService.stopBlockUI();
      }
    } catch (error) {
      this.handleError(error);
    }

    this._sharedService.stopBlockUI();
  }

  public setErrors({ count, result, page, totalCount }: IErrorDetailResponseData): void {
    if (page) {
      this.currentPage = page;
    }
    this.errorsTableData = result;
    this.setAssigneeStatusInactive();
    this.errorsTableDataCopy = cloneDeep(this.errorsTableData);
    this.totalLength = count;
    this.errorService.totalErrorCount.next({ count: totalCount, tabLabel: this.fromTab });
    this.dataSource = new MatTableDataSource<IErrorDetail>(this.errorsTableData);
    this.isDataLoading = false;
    this._sharedService.stopBlockUI();

    if (this.jiraTicketState) {
      const selectedError = this.dataSource.filteredData.filter((item) => item._id === this.jiraTicketState.errorId);
      this.openCreateEditJira(selectedError[0]);
      this.jiraTicketState = null;
      this.jiraTicketStateChange.emit(null);
    }
  }

  private setAssigneeStatusInactive() {

    const activeAssignees = this.localStorageService.getLocalStorage(LocalStorageConstants.ASSIGNEES);
    this.errorsTableData.forEach(x => {
      if ((x.status == ErrorConstants.ERROR_STATUS.RESOLVED || x.status == ErrorConstants.ERROR_STATUS.IN_PROGRESS || x.status == ErrorConstants.ERROR_STATUS.PENDING || x.status == ErrorConstants.ERROR_STATUS.CSR_ACTION) && x.assignedTo && !activeAssignees.map(activeAssignee => activeAssignee.id).includes(x.assignedTo.id)) {
        x.assignedTo.status = TeamMemberStatus.INACTIVE;
      }
    });
  }

  public setHeadersAndColumns(): void {
    if (![ErrorUrlTab.UNRESOLVED_MANUAL, ErrorUrlTab.NEW].includes(this.fromTab) || this.errorService.isRoleAdminOrSupportUser) {
      this.displayedColumns.push(ErrorsTableHeader.JIRA_TICKET);
      this.emptyTableHeader.push({ label: EmptyErrorsTableHeader.JIRA_TICKET, sort: !this.showCreateJiraButton });
    }

    this.paginatorText = this.errorService.getPaginatorText(this.fromTab);
  }

  public async getStatuses(): Promise<void> {
    try {
      const statuses: IStatus[] = await this._statusService.getStatuses({ match: { type: 'manual' } }).toPromise();
      if (statuses.length) {
        this.status = statuses;
      }
    } catch (error) {
      this.handleError(error);

    }
  }

  public getOldErrorStatus(index: number): void {
    this.oldErrorStatus = cloneDeep(this.errorsTableData[index].status);
  }

  public async onStatusChange(status: string, id: string, index: number): Promise<void> {
    if (
      !this.errorsTableData[index].assignedTo ||
      !this.errorsTableData[index].assignedTo.id ||
      !this.errorsTableData[index].assignedTo.name
    ) {
      this.dataSource = null;
      this.errorsTableData[index].status = MessageConstant.PENDING;
      setTimeout(() => {
        this.setErrors({
          count: this.totalLength,
          result: this.errorsTableData,
          page: this.currentPage,
          totalCount: this.totalCount
        });
      });
      this._sharedService.openErrorSnackBar({
        error: MessageConstant.NEW_ERROR_STATUS_CHANGE_ERROR,
        message: MessageConstant.NEW_ERROR_STATUS_CHANGE_ERROR_MESSAGE,
        statusCode: StatusCodeConstant.PRECONDITION_FAILED,
      });
      return;
    }

    try {
      const updateStatusParams = this.getUpadateStatusParams(index);

      const updatedStatus: IErrorDetailResponse = await this.errorService
        .updateErrorDetail(id,
          { status, clientName: this.errorsTableData[index].clientName, serviceName: this.errorsTableData[index].serviceName, environment: this.errorsTableData[index].environment, oldErrorStatus: this.oldErrorStatus, errorTimestamps: this.errorsTableData[index].errorTimestamps }, updateStatusParams).toPromise();
      this.errorService.updateFilterList(this.fromTab);

      if (updatedStatus) {
        this.errorService.triggerTeamOverviewRefresh();
        const isSameTab = this.isSameTab(status, this.errorsTableDataCopy[index].status);
        const noOfErrorsUpdated = updatedStatus.data.errorTimestamps.length;
        if (!isSameTab) {
          this.updateBadgeCount(status, noOfErrorsUpdated);
        }
        if (this.fromTab !== ErrorUrlTab.ALL) {
          if (!isSameTab) {
            this.errorsTableData.splice(index, 1);
          }

          this.setErrors({
            count: isSameTab ? this.totalLength : this.totalLength - 1,
            result: this.errorsTableData,
            page: this.currentPage,
            totalCount: isSameTab ? this.totalCount : this.totalCount - noOfErrorsUpdated
          });
        }
        this._sharedService.openSuccessSnackBar(updatedStatus);
      }
    } catch (error) {
      this._sharedService.openErrorSnackBar(error);
    }
  }

  private getUpadateStatusParams(index: number): any {
    const user = this._authService.getUserData();
    let updateStatusParams;
    if (user._id != this.errorsTableData[index].assignedTo.id && this.errorsTableData[index].assignedTo.status != TeamMemberStatus.INACTIVE) {
      updateStatusParams = { notificationSource: NotificationSource.UPDATE_STATUS, name: user.name.first + ' ' + user.name.last, profilePic: user.meta.profilePic };
    }
    return updateStatusParams;
  }

  public async onAssigneeChange(assignedTo: any, id: string, index: number): Promise<void> {
    try {
      const user = this._authService.getUserData();
      const updatedAssignee: IErrorDetailResponse = await this.errorService
        .updateErrorDetail(
          id,
          { assignedTo: { id: assignedTo.id, name: assignedTo.name, avatar: assignedTo.imageUrl } },
          { notificationSource: NotificationSource.UPDATE_ASSIGNEE, name: user.name.first + ' ' + user.name.last, profilePic: user.meta.profilePic }
        ).toPromise();
      this.errorService.updateFilterList(this.fromTab);
      if (updatedAssignee) {
        this.errorService.triggerTeamOverviewRefresh();
        this.errorsTableData[index].assignedTo = updatedAssignee.data.assignedTo;
        this._sharedService.openSuccessSnackBar(updatedAssignee);
      }
    } catch (error) {
      this._sharedService.openErrorSnackBar(error);
    }
  }

  public onCrossIconClick(): void {
    this.isBulkUpdateAssigneeLoading = false;
    this.isBulkAssigneeSelected = false;
    this.selectedBulkUpdateErrors.clear();
    this.bulkUpdateAssignee = { id: "", name: "", avatar: "" };
  }

  public isCheckboxDisabled(error: IErrorDetail): boolean {
    return !(
      (
        this.errorService.isRoleAdminOrSupportUser ||
        (this.errorService.isRoleCSR && (error.assignedTo && error.assignedTo.id && (error.assignedTo.id == this.errorService.currentUserId)))
      ) && this.activeErrorStatuses.includes(error.status)
    )
  }

  private getSelectedAndSelectableErrors(): { selectableErrorIds: string[], selectedErrorIds: string[] } {
    const selectableErrorIds = this.dataSource.data
      .filter((error) => !this.isCheckboxDisabled(error))
      .map(({ _id }) => _id);

    const selectedErrorIds = this.selectedBulkUpdateErrors.selected
      .filter(id => selectableErrorIds.includes(id));

    return { selectableErrorIds, selectedErrorIds };
  }

  public isAllSelected(): boolean {
    const { selectableErrorIds, selectedErrorIds } = this.getSelectedAndSelectableErrors();
    return selectedErrorIds.length === selectableErrorIds.length;
  }

  public isChecked(_id: string): boolean {
    return this.selectedBulkUpdateErrors.isSelected(_id);
  }

  public toggleAssigneeBulkUpdate(): void {
    this.isBulkAssigneeSelected = this.selectedBulkUpdateErrors.selected.length > 0;
  }

  public onMasterCheckBoxClick(): void {
    const { selectableErrorIds, selectedErrorIds } = this.getSelectedAndSelectableErrors();
    const isAllChecked = selectedErrorIds.length === selectableErrorIds.length;

    isAllChecked ?
      this.selectedBulkUpdateErrors.deselect(...selectedErrorIds) :
      this.dataSource.data
        .filter((error) => !this.isCheckboxDisabled(error))
        .forEach(row => this.selectedBulkUpdateErrors.select(row._id));
  }

  public async onBulkUpdateAssignee(): Promise<void> {
    try {
      this.isBulkUpdateAssigneeLoading = true;
      const ids = this.selectedBulkUpdateErrors.selected;
      const result: ApiResponse<boolean> =
        await this.errorService
          .bulkUpdateAssigneeErrorDetail(ids, this.bulkUpdateAssignee)
          .toPromise();

      if (result.data) {
        this.errorsTableData.forEach((error) => {
          if (ids.includes(error._id)) {
            error.assignedTo = this.bulkUpdateAssignee;
          }
        });
        this._sharedService.openSuccessSnackBar(result);
      }
    } catch (error) {
      this._sharedService.openErrorSnackBar(error);
    } finally {
      this.onCrossIconClick();
    }
  }

  public toggleDescending(index: number): void {
    this.errorsTableData[index]['fullDisplay'] = !this.errorsTableData[index]['fullDisplay'];
  }

  public changePagination(pageSize: number, pageIndex: number): void {
    this.pageSize = pageSize;
    this.currentPage = pageIndex + 1;
    this.getErrors();
  }

  public onSortColumn({ direction, active }: ISorting): void {
    if ((active === 'description') || (this.showCreateJiraButton && active === 'jiraTicket')) {
      return;
    }

    this.isSortingApplied = active as ErrorsTableHeader;
    this.defaultSortingOrder = direction as Sorting;

    const orderBy = direction === Sorting.ASC ? OrderBy.ASC : OrderBy.DESC;
    let sortBy;

    switch (active) {
      case ErrorsTableHeader.ERROR_TYPE: sortBy = SortBy.ERROR_TYPE; break;
      case ErrorsTableHeader.GENERATED_ON: sortBy = SortBy.GENERATED_ON; break;
      case ErrorsTableHeader.SERVICE: sortBy = SortBy.SERVICE; break;
      case ErrorsTableHeader.STATUS: sortBy = SortBy.STATUS; break;
      case ErrorsTableHeader.ASSIGNEE: sortBy = SortBy.ASSIGNEE; break;
      case ErrorsTableHeader.JIRA_TICKET: sortBy = SortBy.JIRA_TICKET; break;
    }
    this.sortBy = sortBy;
    this.orderBy = orderBy;

    this.getErrors();
  }

  public sortingIconClass(appliedSorting: ErrorsTableHeader) {
    return {
      sorting: this.isSortingApplied === appliedSorting,
      asc: this.defaultSortingOrder === Sorting.ASC
    };
  }

  public handleError(error: IErrorResponse): void {
    this.isDataLoading = true;
    this._sharedService.openErrorSnackBar(error);
    this._sharedService.stopBlockUI();
  }

  public goToLink(url: string): void {
    if (url) {
      window.open(this.jiraBaseURL + url, '_blank');
    }
  }

  private getJiraUrl(): string {
    return JiraConstants.JIRA_PERMISSION_URL.replace(JiraConstants.JIRA_STATE_VARIABLE, this.jiraTicketState);
  }

  public async openCreateEditJira(info: any): Promise<void> {
    try {
      const isJiraLogin = this.localStorageService.getLocalStorage(LocalStorageConstants.IS_JIRA_LOGGEDIN);

      if (isJiraLogin) {
        this.isDataLoading = true;
        const jiraPermissionResponse = await this._jiraService
          .checkJiraPermission(JiraConstants.JIRA_CREATE_PERMISSION).toPromise();
        this.isDataLoading = false;
        if (jiraPermissionResponse.data && jiraPermissionResponse.data.permissions.CREATE_ISSUES.havePermission) {
          const dialogRef = this._dialog.open(CreateEditJiraTicketComponent, {
            width: CssConstant.CREATE_JIRA_TICKET_POPUP_WIDTH,
            disableClose: true,
            data: {
              title: MessageConstant.CREATE_JIRA,
              btnTxt: MessageConstant.CREATE,
              btnSubTxt: MessageConstant.CANCEL,
              isDisabled: true,
              data: info,
            },
          });


          dialogRef.afterClosed().subscribe(({ isTicketCreated, noOfErrorUpdated }) => {
            if (isTicketCreated) {
              this.updateBadgeCount(ErrorConstants.JIRA_TICKET_CREATED, noOfErrorUpdated);
              this.errorService.updateFilterList(this.fromTab);
              this.changePagination(this.pageSize, this.currentPage);
            }
          });
        } else {
          this._sharedService.openErrorSnackBar(jiraPermissionResponse);
        }
      } else {
        this.setJiraState(info._id);
        window.location.href = this.getJiraUrl();
      }
    } catch (error) {
      this._sharedService.openErrorSnackBar(error);
    }
  }

  private isSameTab(newStatus: string, oldStatus: string): boolean {
    return (newStatus === ErrorConstants.ERROR_STATUS.CSR_ACTION && oldStatus === ErrorConstants.ERROR_STATUS.IN_PROGRESS ||
      newStatus === ErrorConstants.ERROR_STATUS.IN_PROGRESS && oldStatus === ErrorConstants.ERROR_STATUS.CSR_ACTION);
  }

  private setJiraState(errorId: string): void {
    const state: IJiraState = {
      tab: this.fromTab,
      page: this.currentPage,
      limit: this.pageSize,
      errorId
    };

    this.jiraTicketState = this.errorService.getSerializeJiraState(state);
  }

  private updateBadgeCount(status: string, noOfErrorsUpdated: number): void {
    const tabAdjustments = {};
    switch (status) {
      case ErrorConstants.ERROR_STATUS.CSR_ACTION:
      case ErrorConstants.ERROR_STATUS.IN_PROGRESS:
        this.fromTab === ErrorUrlTab.ALL ?
          tabAdjustments[ErrorUrlTab.NEW] = - noOfErrorsUpdated : tabAdjustments[this.fromTab] = -noOfErrorsUpdated;
        tabAdjustments[ErrorUrlTab.UNRESOLVED_MANUAL] = +noOfErrorsUpdated;
        break;

      case ErrorConstants.ERROR_STATUS.PENDING:
        this.fromTab === ErrorUrlTab.ALL ?
          tabAdjustments[ErrorUrlTab.UNRESOLVED_MANUAL] = -noOfErrorsUpdated : tabAdjustments[this.fromTab] = -noOfErrorsUpdated;
        tabAdjustments[ErrorUrlTab.NEW] = +noOfErrorsUpdated;
        break;

      case ErrorConstants.ERROR_STATUS.RESOLVED:
        if (this.fromTab !== ErrorUrlTab.ALL) {
          tabAdjustments[this.fromTab] = -noOfErrorsUpdated;
        }
        tabAdjustments[ErrorUrlTab.RESOLVED] = +noOfErrorsUpdated;
        break;

      case ErrorConstants.JIRA_TICKET_CREATED:
        if (this.fromTab !== ErrorUrlTab.ALL) {
          tabAdjustments[this.fromTab] = -noOfErrorsUpdated;
        }
        tabAdjustments[ErrorUrlTab.UNRESOLVED_JIRA] = +noOfErrorsUpdated;
        break;
    }
    this.updateBadge.emit(tabAdjustments);
  }

  private setDashboardParamsSubscription(): void {
    this.dashboardFilters$ = this._dashboardService.getDashboardFilters().subscribe((data: IDashboardSearchFilters) => {
      let filters = data;
      if (!filters) {
        filters = {
          clientNames: HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS.map(client => client.name),
          environments: HomeDropdownConstants.DEFAULT_SELECTED_ENVIRONMENTS.map(env => env.name),
          services: HomeDropdownConstants.DEFAULT_SELECTED_SERVICES.map(service => service.name)
        };
      }
      this.isDataLoading = true;
      this.errorService.setDashboardFilterMatch(filters);
      this.getErrors();
    });
  }

  ngOnDestroy(): void {
    if (this.errorType$) {
      this.errorType$.unsubscribe();
    }

    if (this.dashboardFilters$) {
      this.dashboardFilters$.unsubscribe();
    }
  }

}
