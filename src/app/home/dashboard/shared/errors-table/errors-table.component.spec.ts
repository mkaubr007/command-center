import { ApiResponse } from './../../../../shared/models/util/api-response';
import { cloneDeep } from 'lodash';
import { StatusCodeConstant } from './../../../../core/constants/status-code.constant';
import { MessageConstant } from './../../../../core/constants/message.constant';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BlockUIModule } from 'ng-block-ui';
import { NgSelectModule } from '@ng-select/ng-select';
import { LocalStorageService } from './../../../../core/services/local-storage.service';
import { ErrorsTableHeader, ErrorUrlTab } from './../../../../shared/enums/error-tab.enum';
import { SharedHomeModule } from '../../../shared-home/shared-home.module';
import { MaterialModule } from '../../../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedService } from '../../../../shared/shared.service';
import { CustomHttpService } from '../../../../core/services/http.service';
import { Observable, of, throwError } from 'rxjs';
import { ManageClientsComponent } from '../../../team/shared/components/manage-clients/manage-clients.component';
import { IErrorDetail, IErrorDetailResponse, IErrorDetailResponseData } from '../../../../shared/models/error-detail/error-detail.interface';
import { TeamService } from '../../../team/team.service';
import { ManageTeam } from '../../../team/shared/components/manage-teams/test.constants';
import { IClientServiceRep } from '../../../../shared/models/client-service-rep/client-service-rep';
import { LocalStorageConstants } from '../../../../core/constants/local-storage.constants';
import { StatusService } from '../../../../shared/services/status.service';
import { IStatus } from '../../../../shared/models/status/status.interface';
import { JiraService } from 'src/app/shared/services/jira.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorsTableComponent } from './errors-table.component';
import { NewErrorsList } from '../components/errors-tab/shared/constants/errors-test.constants';
import { ErrorService } from '../components/errors-tab/error.service';
import { OrderBy, SortBy, Sorting } from '../components/errors-tab/shared/enum/errors.enum';
import { ErrorConstants } from '../components/errors-tab/shared/constants/error.constants';
import { IDashboardSearchFilters } from '../../../../shared/models/dashboard/dashboard-search-filters.interface';
import { AuthService } from '../../../../auth/auth.service';
import { IUser } from '../../../../shared/models/auth/auth';
import { MatTableDataSource } from '@angular/material/table';
import { errorDetailResult, ids, assignedTo } from "./errors-table.component.spec.data.json";
import { NotificationSource } from '../../../../shared/enums/notification.enum';

describe('ErrorsTableComponent', () => {
  let component: ErrorsTableComponent;
  let fixture: ComponentFixture<ErrorsTableComponent>;
  let localStorage: LocalStorageService;
  let errorService: ErrorService;
  let statusService: StatusService;
  let authService: AuthService;
  let jiraService: JiraService;
  let sharedService: SharedService;
  const { location } = window;
  const dialogMock = { close: (value = '') => { } };

  class ErrorServiceMock {
    totalErrorCount = {
      next: () => { }
    };

    getErrors(): Observable<IErrorDetailResponseData> {
      return of(NewErrorsList.ERROR_DETAIL_RESPONSE);
    }

    updateErrorDetail(): Observable<IErrorDetailResponse> {
      return of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE);
    }

    getPaginatorText(): string {
      return NewErrorsList.PAGINATOR_TEXT;
    }

    getErrorTypeSearch(): string {
      return NewErrorsList.GET_ERROR_PARAMS.searchBy;
    }

    getErrorMatchCriteria(): any {
      return { status: { $in: ['Pending'] } };
    }

    getSerializeJiraState(): string {
      return `tab:${ErrorUrlTab.UNRESOLVED_MANUAL};page:1;limit:1;errorId:123`;
    }

    errorTypeKeyChange(): Observable<boolean> {
      return of(true);
    }

    updateFilterList(): void { }

    bulkUpdateAssigneeErrorDetail(): Observable<ApiResponse<boolean>> {
      return of({ data: true })
    }

    triggerTeamOverviewRefresh(): void {}
  }

  class MockJiraService {
    getIssues() {
      return Promise.resolve({});
    }

    getIssueTypes() {
      return Promise.resolve({});
    }

    getJiraUsers() {
      return Promise.resolve({});
    }

    checkJiraPermission() {
      const response = {
        statusCode: 400,
        message: 'Not exist'
      };

      return of(response);
    }
  }

  class TeamServiceMock {
    searchErrorDetails(): Observable<IClientServiceRep[]> {
      return of(ManageTeam.assigneeList);
    }
  }

  class StatusServiceMock {
    getStatuses(): Observable<IStatus[]> {
      return of(NewErrorsList.GET_STATUS_SUCCESS_RESPONSE.data);
    }
  }

  class AuthServiceMock {
    getUserData(): IUser {
      return NewErrorsList.USER as IUser;
    }
  }

  class SharedServiceMock {
    startBlockUI() { }
    stopBlockUI() { }
    openErrorSnackBar() { }
    openSuccessSnackBar() { }
  }

  beforeAll((): void => {
    delete window.location;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    window.location = {
      href: '',
    };
  });

  afterAll((): void => {
    window.location = location;
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ErrorsTableComponent],
      imports: [
        SharedHomeModule,
        MaterialModule,
        CommonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        FormsModule,
        BlockUIModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        NgSelectModule
      ],
      providers: [
        LocalStorageService,
        { provide: TeamService, useClass: TeamServiceMock },
        { provide: ErrorService, useClass: ErrorServiceMock },
        { provide: StatusService, useClass: StatusServiceMock },
        { provide: JiraService, useClass: MockJiraService },
        { provide: SharedService, useClass: SharedServiceMock },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: AuthService, useClass: AuthServiceMock },
        MatDialog,
        CustomHttpService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ManageClientsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();


    localStorage = TestBed.inject(LocalStorageService);
    errorService = TestBed.inject(ErrorService);
    sharedService = TestBed.inject(SharedService);
    statusService = TestBed.inject(StatusService);
    authService = TestBed.inject(AuthService);
    jiraService = TestBed.inject(JiraService);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, NewErrorsList.LOCAL_STORAGE_CONSTANTS.user_id);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.ROLE, NewErrorsList.LOCAL_STORAGE_CONSTANTS.role);

    fixture = TestBed.createComponent(ErrorsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the jira url link', () => {
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.IS_JIRA_LOGGEDIN, 'false');
    const setJiraStateSpy = jest.spyOn<any, any>(component, 'setJiraState');
    component.openCreateEditJira({ _id: 123 });

    expect(setJiraStateSpy).toHaveBeenCalledWith(123);
    const jiraUrl = component['getJiraUrl']();
    expect(window.location.href)
      .toEqual(jiraUrl);
  });

  it('should set jira state and jira callback url', async () => {
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.IS_JIRA_LOGGEDIN, 'false');
    component.currentPage = 1;
    component.pageSize = 1;

    await component.openCreateEditJira({ _id: 123 });

    const firstState = `tab:${ErrorUrlTab.UNRESOLVED_MANUAL};page:1;limit:1;errorId:123`;

    expect(component.jiraTicketState).toEqual(firstState);
  });

  it('should get the search params', () => {
    const getSearchParamsResult = component.getSearchParams();

    expect(getSearchParamsResult)
      .toEqual(NewErrorsList.SEARCH_PARAM_RESULT);
  });

  it('should get the list of errors', async () => {
    component.fromTab = ErrorUrlTab.ALL;
    const getErrorsSpy = jest
      .spyOn(errorService, 'getErrors')
      .mockImplementation(() => of(NewErrorsList.ERROR_DETAIL_RESPONSE));

    const setErrorDetailDataSpy = jest
      .spyOn(component, 'setErrors')
      .mockImplementation();

    const startBlockUISpy = jest
      .spyOn(sharedService, 'startBlockUI')
      .mockImplementation();

    await component.getErrors();

    expect(getErrorsSpy).toHaveBeenCalledWith(
      NewErrorsList.GET_ERROR_PARAMS.sort_by,
      NewErrorsList.GET_ERROR_PARAMS.order_by,
      NewErrorsList.GET_ERROR_PARAMS.limit,
      NewErrorsList.GET_ERROR_PARAMS.page,
      NewErrorsList.GET_ERROR_PARAMS.match,
      NewErrorsList.GET_ERROR_PARAMS.searchBy,
      NewErrorsList.GET_ERROR_PARAMS.errorKey
    );
    expect(setErrorDetailDataSpy).toHaveBeenCalled();
    expect(startBlockUISpy).toHaveBeenCalled();
  });

  it('should return empty list of errors', async () => {
    component.fromTab = ErrorUrlTab.ALL;
    const getErrorsSpy = jest
      .spyOn(errorService, 'getErrors')
      .mockImplementation(() => of());

    const stopBlockUISpy = jest
      .spyOn(sharedService, 'stopBlockUI')
      .mockImplementation();
    
    await component.getErrors();

    expect(getErrorsSpy).toHaveBeenCalled();
    expect(component.isDataLoading).toBeFalsy();
    expect(stopBlockUISpy).toHaveBeenCalled();
  });

  it('should throw error while getting the list of errors ', async () => {
    component.fromTab = ErrorUrlTab.ALL;
    const getErrorsSpy = jest
      .spyOn(errorService, 'getErrors')
      .mockImplementation(() => throwError(NewErrorsList.ERROR_DETAIL_ERROR_RESPONSE));

    const handleErrorSpy = jest
      .spyOn<any, string>(component, 'handleError')
      .mockImplementation(() => NewErrorsList.ERROR_DETAIL_ERROR_RESPONSE);

    const startBlockUISpy = jest
      .spyOn(sharedService, 'startBlockUI')
      .mockImplementation();

    const stopBlockUISpy = jest
      .spyOn(sharedService, 'stopBlockUI')
      .mockImplementation();

    await component.getErrors();

    expect(getErrorsSpy).toHaveBeenCalledWith(
      NewErrorsList.GET_ERROR_PARAMS.sort_by,
      NewErrorsList.GET_ERROR_PARAMS.order_by,
      NewErrorsList.GET_ERROR_PARAMS.limit,
      NewErrorsList.GET_ERROR_PARAMS.page,
      NewErrorsList.GET_ERROR_PARAMS.match,
      NewErrorsList.GET_ERROR_PARAMS.searchBy,
      NewErrorsList.GET_ERROR_PARAMS.errorKey
    );

    expect(handleErrorSpy)
      .toHaveBeenCalledWith(NewErrorsList.ERROR_DETAIL_ERROR_RESPONSE);
    expect(startBlockUISpy).toHaveBeenCalled();
    expect(stopBlockUISpy).toHaveBeenCalled();
  });

  it('should set error data', () => {
    component.jiraTicketState = '';
    const blockUIStop = jest
      .spyOn(sharedService, 'stopBlockUI')
      .mockImplementation();

    component
      .setErrors({ result: NewErrorsList.ERROR_DETAIL_RESPONSE.result, count: NewErrorsList.ERROR_DETAIL_RESPONSE.count });

    expect(blockUIStop).toHaveBeenCalled();
    expect(component.dataSource).toBeTruthy();
    expect(component.isDataLoading).toBeFalsy();
  });

  it('should set error data and open create jira popup', () => {
    component.jiraTicketState = 'some-status';
    const blockUIStop = jest
      .spyOn(sharedService, 'stopBlockUI')
      .mockImplementation();

    const openCreateEditJiraSpy = jest
      .spyOn(component, 'openCreateEditJira')
      .mockImplementation();

    component
      .setErrors({ result: NewErrorsList.ERROR_DETAIL_RESPONSE.result, count: NewErrorsList.ERROR_DETAIL_RESPONSE.count });

    expect(blockUIStop).toHaveBeenCalled();
    expect(openCreateEditJiraSpy).toHaveBeenCalled();
    expect(component.dataSource).toBeTruthy();
    expect(component.isDataLoading).toBeFalsy();
  });

  it('should open crete jira ticket popup if state exists and reset it', () => {
    jest.spyOn(component, 'openCreateEditJira').getMockImplementation();

    component.jiraTicketState = NewErrorsList.JIRA_MANUAL_ERROR_STATE;

    component.setErrors({
      result: NewErrorsList.ERROR_DETAIL_RESPONSE.result,
      count: NewErrorsList.ERROR_DETAIL_RESPONSE.count,
      page: NewErrorsList.ERROR_DETAIL_RESPONSE.page
    });

    expect(component.openCreateEditJira)
      .toHaveBeenCalledWith(NewErrorsList.ERROR_DETAIL_RESPONSE.result[0]);
    expect(component.jiraTicketState).toBe(null);
  });

  it('should set paginatorText', () => {
    component.setHeadersAndColumns();

    expect(component.paginatorText).toEqual(NewErrorsList.PAGINATOR_TEXT);
  });

  it('should fetch list of statuses successfully', async () => {
    const spy = jest
      .spyOn(statusService, 'getStatuses')
      .mockImplementationOnce(() => of(NewErrorsList.GET_STATUS_SUCCESS_RESPONSE.data));

    await component.getStatuses();

    expect(spy)
      .toHaveBeenCalledWith(NewErrorsList.GET_STATUS_PARAMS);

  });

  it('should return empty list of statuses', async () => {
    component.status = []
    const spy = jest
      .spyOn(statusService, 'getStatuses')
      .mockImplementationOnce(() => of([]));
    
    await component.getStatuses();
    expect(spy).toHaveBeenCalledWith(NewErrorsList.GET_STATUS_PARAMS);
    expect(component.status.length).toBe(0);
  });

  it('should get old error status', () => {
    const error = cloneDeep(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data);
    component.errorsTableData = [error];

    component.getOldErrorStatus(0);

    expect(component.oldErrorStatus).toBe(ErrorConstants.ERROR_STATUS.IN_PROGRESS);
  });

  it('should throw error while fetching list of statuses', async () => {
    const spy = jest
      .spyOn(statusService, 'getStatuses')
      .mockImplementation(() => throwError((NewErrorsList.GET_STATUS_FAILURE_RESPONSE)));
    const handleErrorSpy = jest
      .spyOn<any, string>(component, 'handleError')
      .mockImplementation(() => NewErrorsList.GET_STATUS_FAILURE_RESPONSE);

    await component.getStatuses();

    expect(spy)
      .toHaveBeenCalledWith(NewErrorsList.GET_STATUS_PARAMS);
    expect(handleErrorSpy)
      .toHaveBeenCalledWith(NewErrorsList.GET_STATUS_FAILURE_RESPONSE);
  });

  it('should update the status successfully', async () => {
    const updateErrorDetailSpy = jest
      .spyOn(errorService, 'updateErrorDetail')
      .mockImplementationOnce(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE));

    jest.spyOn<any, any>(component,'isSameTab').mockImplementationOnce(() => true);

    const openSuccessSnackBar = jest
      .spyOn(sharedService, 'openSuccessSnackBar')
      .mockImplementation(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE));

    const triggerTeamOverviewRefreshSpy = jest.spyOn(errorService,'triggerTeamOverviewRefresh').mockImplementation();

    await component.onStatusChange(
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data.status,
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data._id,
      0
    );
    expect(updateErrorDetailSpy).toHaveBeenCalled();
    expect(triggerTeamOverviewRefreshSpy).toHaveBeenCalled();
    expect(openSuccessSnackBar).toHaveBeenCalledWith(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE);
  });

  it('should throw error while updating the status assignee because there is no assignee', async () => {
    const error = cloneDeep(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data);
    error.assignedTo = undefined;
    component.errorsTableData = [error];
    jest.useFakeTimers();

    const openErrorSnackBar = jest
      .spyOn(sharedService, 'openErrorSnackBar')
      .mockImplementation();

    const setErrorsSpy = jest
      .spyOn(component, 'setErrors').mockImplementation();

    await component.onStatusChange(error.status, error._id, 0);
    jest.runAllTimers();

    expect(openErrorSnackBar).toHaveBeenCalledWith({
      error: MessageConstant.NEW_ERROR_STATUS_CHANGE_ERROR,
      message: MessageConstant.NEW_ERROR_STATUS_CHANGE_ERROR_MESSAGE,
      statusCode: StatusCodeConstant.PRECONDITION_FAILED,
    });
    expect(setErrorsSpy).toHaveBeenCalled();
  });

  it('should throw error while updating the status assignee', async () => {
    const spy = jest
      .spyOn(errorService, 'updateErrorDetail')
      .mockImplementation(() => throwError(NewErrorsList.ERROR_DETAIL_ERROR_RESPONSE));

    const openErrorSnackBar = jest
      .spyOn(sharedService, 'openErrorSnackBar')
      .mockImplementation();

    await component.onStatusChange(
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data.status,
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data._id,
      0
    );

    expect(spy).toHaveBeenCalled();
    expect(openErrorSnackBar).toHaveBeenCalledWith(NewErrorsList.ERROR_DETAIL_ERROR_RESPONSE);
  });

  it('should update the particular assignee successfully', async () => {
    component.fromTab = ErrorUrlTab.ALL;
    const updateFilterListSpy = jest.spyOn(errorService, 'updateFilterList').mockImplementation();
    const spy = jest
      .spyOn(errorService, 'updateErrorDetail')
      .mockImplementationOnce(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE));

    const triggerTeamOverviewRefreshSpy = jest.spyOn(errorService,'triggerTeamOverviewRefresh').mockImplementation();
    const openSuccessSnackBar = jest
      .spyOn(sharedService, 'openSuccessSnackBar')
      .mockImplementation(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE));

    await component.onAssigneeChange(
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data.assignedTo,
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data._id,
      0
    );

    expect(updateFilterListSpy).toHaveBeenCalledWith(component.fromTab);
    expect(spy).toHaveBeenCalledWith(
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data._id,
      {
        assignedTo: NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data.assignedTo
      },
      { notificationSource: NotificationSource.UPDATE_ASSIGNEE, name: NewErrorsList.USER.name.first + ' ' + NewErrorsList.USER.name.last, profilePic: NewErrorsList.USER.meta.profilePic }
    );
    expect(triggerTeamOverviewRefreshSpy).toHaveBeenCalled();
    expect(openSuccessSnackBar).toHaveBeenCalledWith(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE);
  });

  it('should not trigger team overview refresh if particular assignee is not updated', () => {
    jest
      .spyOn(errorService, 'updateErrorDetail')
      .mockImplementationOnce(() => of());

    const triggerTeamOverviewRefreshSpy = jest.spyOn(errorService,'triggerTeamOverviewRefresh').mockImplementation();

    component.onAssigneeChange(
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data.assignedTo,
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data._id,
      0
    );

    expect(triggerTeamOverviewRefreshSpy).toHaveBeenCalledTimes(0);
  });
  it('should throw error while updating the particular assignee', async () => {
    const getUserDataSpy = jest
      .spyOn(authService, 'getUserData');

    const spy = jest
      .spyOn(errorService, 'updateErrorDetail')
      .mockImplementation(() => throwError(NewErrorsList.ERROR_DETAIL_ERROR_RESPONSE));

    const openErrorSnackBar = jest
      .spyOn(sharedService, 'openErrorSnackBar')
      .mockImplementation(() => throwError(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE));

    await component.onAssigneeChange(
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data.assignedTo,
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data._id,
      0
    );

    expect(getUserDataSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(openErrorSnackBar).toHaveBeenCalledWith(NewErrorsList.ERROR_DETAIL_ERROR_RESPONSE);
  });

  it('should toggle the fullDisplay property of error', () => {
    component.errorsTableData = NewErrorsList.ERROR_DETAIL_RESPONSE.result;

    component.errorsTableData[0]['fullDisplay'] = true;
    component.toggleDescending(0);
    expect(component.errorsTableData[0]['fullDisplay']).toEqual(false);
    component.errorsTableData = [];
  });

  it('should get error data after setting the pagination', async () => {
    const getErrorDataSpy = jest.spyOn(component, 'getErrors')
      .mockImplementation();

    component.changePagination(1, 0);

    expect(component.pageSize).toEqual(1);
    expect(component.currentPage).toEqual(1);
    expect(getErrorDataSpy).toHaveBeenCalled();
  });

  it('should get error data after setting the sorting', async () => {
    const getErrorDataSpy = jest.spyOn(component, 'getErrors')
      .mockImplementation();
    
    component.showCreateJiraButton = true;  
    component.onSortColumn({ direction: Sorting.ASC, active: 'description' });

    component.showCreateJiraButton = false;
    component.onSortColumn({ direction: Sorting.ASC, active: ErrorsTableHeader.GENERATED_ON });

    expect(component.sortBy).toEqual(SortBy.GENERATED_ON);
    expect(component.orderBy).toEqual(OrderBy.ASC);
    expect(getErrorDataSpy).toHaveBeenCalled();
  });

  it('should sort by error type', () => {
    jest.spyOn(component, 'getErrors')
      .mockImplementation();

    component.onSortColumn({ direction: Sorting.ASC, active: ErrorsTableHeader.ERROR_TYPE });
    expect(component.sortBy).toBe(ErrorsTableHeader.ERROR_TYPE);
  });

  it('should sort by service in ascending order', () => {
    jest.spyOn(component, 'getErrors')
      .mockImplementation();

    component.onSortColumn({ direction: Sorting.ASC, active: ErrorsTableHeader.SERVICE });
    expect(component.sortBy).toBe(SortBy.SERVICE);
  });

  it('should sort by status in ascending order', () => {
    jest.spyOn(component, 'getErrors')
      .mockImplementation();

    component.onSortColumn({ direction: Sorting.ASC, active: ErrorsTableHeader.STATUS });
    expect(component.sortBy).toBe(SortBy.STATUS);
  });

  it('should sort by asignee in ascending order', () => {
    jest.spyOn(component, 'getErrors')
      .mockImplementation();

    component.onSortColumn({ direction: Sorting.ASC, active: ErrorsTableHeader.ASSIGNEE });
    expect(component.sortBy).toBe(SortBy.ASSIGNEE);
  });

  it('should sort by jira ticket id in ascending order', () => {
    jest.spyOn(component, 'getErrors')
      .mockImplementation();

    component.onSortColumn({ direction: Sorting.ASC, active: ErrorsTableHeader.JIRA_TICKET });
    expect(component.sortBy).toBe(SortBy.JIRA_TICKET);
  });

  it('should sort by jira ticket id in descending order', () => {
    jest.spyOn(component, 'getErrors')
      .mockImplementation();

    component.onSortColumn({ direction: Sorting.DESC, active: ErrorsTableHeader.JIRA_TICKET });
    expect(component.sortBy).toBe(SortBy.JIRA_TICKET);
    expect(component.orderBy).toBe(-1);
  });

  it('should get the sorting icon css-class', async () => {
    const resultClass = component.sortingIconClass(ErrorsTableHeader.GENERATED_ON);
    expect(resultClass).toEqual({ sorting: true, asc: false });
  });

  it('should handle the errors', () => {
    const openSnackBarSpy = jest
      .spyOn(sharedService, 'openErrorSnackBar')
      .mockImplementation();

    const stopBlockUISpy = jest
      .spyOn(sharedService, 'stopBlockUI')
      .mockImplementation();

    const error = {
      error: 'Undefined Error',
      message: 'Value not found',
      statusCode: 400,
    };

    component.handleError(error);

    expect(component.isDataLoading).toEqual(true);
    expect(openSnackBarSpy).toHaveBeenCalledWith(error);
    expect(stopBlockUISpy).toHaveBeenCalled();
  });

  it('should open the jira link', () => {
    const windowOpenSpy = jest.spyOn(window, 'open')
      .mockImplementation();

    component.goToLink('link');
    expect(windowOpenSpy).toHaveBeenCalled();
  });

  it('should not do anything if link is not provided', () => {
    component.goToLink('');
  });

  it('should open CreateEditJiraTicketComponent', async () => {
    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of({ isTicketCreated: true, noOfErrorUpdated: 2}) });

    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.IS_JIRA_LOGGEDIN, 'true');

    jest.spyOn(jiraService, 'checkJiraPermission')
      .mockImplementation(() => of(NewErrorsList.ERROR_PERMISSION_SUCCESS_RESPONSE));

    const updateBadgeCountSpy = jest.spyOn<any, any>(component, 'updateBadgeCount').mockImplementation();
    const updateFilterListSpy = jest.spyOn(errorService, 'updateFilterList').mockImplementation();
    const changePaginationSpy = jest.spyOn(component, 'changePagination').mockImplementation();

    component.currentPage = 1;
    component.pageSize = 1;
    component.fromTab = ErrorUrlTab.ALL;

    await component.openCreateEditJira({ _id: 123 });

    expect(updateBadgeCountSpy).toHaveBeenCalledWith(ErrorConstants.JIRA_TICKET_CREATED, 2);
    expect(updateFilterListSpy).toHaveBeenCalledWith(ErrorUrlTab.ALL);
    expect(changePaginationSpy).toHaveBeenCalledWith(1, 1);

  });

  it('should open CreateEditJiraTicketComponent and not update badge count', () => {
    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of({ isTicketCreated: false, noOfErrorUpdated: 2}) });

    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.IS_JIRA_LOGGEDIN, 'true');

    jest.spyOn(jiraService, 'checkJiraPermission')
        .mockImplementation(() => of(NewErrorsList.ERROR_PERMISSION_SUCCESS_RESPONSE));
    
    const updateBadgeCountSpy = jest.spyOn<any, any>(component, 'updateBadgeCount').mockImplementation();
    expect(updateBadgeCountSpy).toHaveBeenCalledTimes(0);
  });

  it('should throw error while trying to create or edit jira ticket', async () => {
    jest.spyOn(component['localStorageService'], 'getLocalStorage').mockImplementation(() => {throw new Error()});
    const openErrorSnackBarSpy = jest.spyOn(sharedService, 'openErrorSnackBar').mockImplementation();

    await component.openCreateEditJira({ _id: 123 });

    expect(openErrorSnackBarSpy).toHaveBeenCalledWith(new Error());
  });

  it('should update badge count when status is pending and tab is All errors', async () => {
    jest
      .spyOn(errorService, 'updateErrorDetail')
      .mockImplementation(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE))

    const error = cloneDeep(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data);
    component.errorsTableDataCopy = Array(10).fill(error);
    component.errorsTableData = cloneDeep(component.errorsTableDataCopy);

    jest.spyOn<any, any>(component,'isSameTab').mockImplementation(() => false);

    const updateBadgeEmitSpy = jest.spyOn(component.updateBadge,'emit').mockImplementation();

    component.fromTab = ErrorUrlTab.ALL;
    await component.onStatusChange(ErrorConstants.ERROR_STATUS.PENDING, '1', 0);
    expect(updateBadgeEmitSpy).toHaveBeenCalledWith(NewErrorsList.TAB_ADJUSTMENTS_ALL_ERROR_TAB_PENDING_STATUS);
  });

  it('should update badge count when status is pending and tab is new errors', async () => {
    jest
      .spyOn(errorService, 'updateErrorDetail')
      .mockImplementation(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE))

    const error = cloneDeep(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data);
    component.errorsTableDataCopy = Array(10).fill(error);
    component.errorsTableData = cloneDeep(component.errorsTableDataCopy);

    jest.spyOn<any, any>(component,'isSameTab').mockImplementation(() => false);

    const updateBadgeEmitSpy = jest.spyOn(component.updateBadge,'emit').mockImplementation();

    component.fromTab = ErrorUrlTab.NEW;
    await component.onStatusChange(ErrorConstants.ERROR_STATUS.PENDING, '1', 0);
    expect(updateBadgeEmitSpy).toHaveBeenCalledWith(NewErrorsList.TAB_ADJUSTMENTS_NEW_ERROR_TAB_PENDING_STATUS);
  });

  it('should update badge count when status is resolved and tab is resolved errors', async () => {
    jest
      .spyOn(errorService, 'updateErrorDetail')
      .mockImplementation(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE))

    const error = cloneDeep(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data);
    component.errorsTableDataCopy = Array(10).fill(error);
    component.errorsTableData = cloneDeep(component.errorsTableDataCopy);

    jest.spyOn<any, any>(component,'isSameTab').mockImplementation(() => false);

    const updateBadgeEmitSpy = jest.spyOn(component.updateBadge,'emit').mockImplementation();

    component.fromTab = ErrorUrlTab.RESOLVED;
    await component.onStatusChange(ErrorConstants.ERROR_STATUS.RESOLVED, '1', 0);
    expect(updateBadgeEmitSpy).toHaveBeenCalledWith(NewErrorsList.TAB_ADJUSTMENTS_RESOLVED_ERROR_TAB_RESOLVED_STATUS);
  });

  it('should update badge count when status is resolved and tab is all errors', async () => {
    jest
      .spyOn(errorService, 'updateErrorDetail')
      .mockImplementation(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE))

    const error = cloneDeep(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data);
    component.errorsTableDataCopy = Array(10).fill(error);
    component.errorsTableData = cloneDeep(component.errorsTableDataCopy);

    jest.spyOn<any, any>(component,'isSameTab').mockImplementation(() => false);

    const updateBadgeEmitSpy = jest.spyOn(component.updateBadge,'emit').mockImplementation();

    component.fromTab = ErrorUrlTab.ALL;
    await component.onStatusChange(ErrorConstants.ERROR_STATUS.RESOLVED, '1', 0);
    expect(updateBadgeEmitSpy).toHaveBeenCalledWith(NewErrorsList.TAB_ADJUSTMENTS_ALL_ERROR_TAB_RESOLVED_STATUS);
  });

  it('should update badge count when status is jira ticket created and tab is resolved errors', async () => {
    jest
      .spyOn(errorService, 'updateErrorDetail')
      .mockImplementation(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE))

    const error = cloneDeep(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data);
    component.errorsTableDataCopy = Array(10).fill(error);
    component.errorsTableData = cloneDeep(component.errorsTableDataCopy);

    jest.spyOn<any, any>(component,'isSameTab').mockImplementation(() => false);

    const updateBadgeEmitSpy = jest.spyOn(component.updateBadge,'emit').mockImplementation();

    component.fromTab = ErrorUrlTab.RESOLVED;
    await component.onStatusChange(ErrorConstants.JIRA_TICKET_CREATED, '1', 0);
    expect(updateBadgeEmitSpy).toHaveBeenCalledWith(NewErrorsList.TAB_ADJUSTMENTS_RESOLVED_ERROR_TAB_JIRA_TICKET_CREATED_STATUS);
  });

  it('should update badge count when status is jira ticket created and tab is all errors', async () => {
    jest
      .spyOn(errorService, 'updateErrorDetail')
      .mockImplementation(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE))

    const error = cloneDeep(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE.data);
    component.errorsTableDataCopy = Array(10).fill(error);
    component.errorsTableData = cloneDeep(component.errorsTableDataCopy);

    jest.spyOn<any, any>(component,'isSameTab').mockImplementation(() => false);

    const updateBadgeEmitSpy = jest.spyOn(component.updateBadge,'emit').mockImplementation();

    component.fromTab = ErrorUrlTab.ALL;
    await component.onStatusChange(ErrorConstants.JIRA_TICKET_CREATED, '1', 0);
    expect(updateBadgeEmitSpy).toHaveBeenCalledWith(NewErrorsList.TAB_ADJUSTMENTS_ALL_ERROR_TAB_JIRA_TICKET_CREATED_STATUS);
  });

  it('should Display the error message if permission not found', async () => {
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.IS_JIRA_LOGGEDIN, "true");

    jest.spyOn(jiraService, 'checkJiraPermission')
      .mockReturnValue(of(NewErrorsList.ERROR_PERMISSION_FAIL_RESPONSE));

    const openErrorSnackBarSpy = jest.spyOn(sharedService, 'openErrorSnackBar')
      .mockImplementation();

    await component.openCreateEditJira({ _id: 123 });

    expect(openErrorSnackBarSpy)
      .toHaveBeenCalledWith(NewErrorsList.ERROR_PERMISSION_FAIL_RESPONSE);
  });

  it('should check for error type search', async () => {
    const setHeadersAndColumnsMock = jest.spyOn(component, 'setHeadersAndColumns').mockImplementation();
    const getStatusesMock = jest.spyOn(component, 'getStatuses').mockImplementation();
    const getErrorsMock = jest.spyOn(component, 'getErrors').mockImplementation();
    const errorTypeKeyChangeMock = jest.spyOn(component.errorService, 'errorTypeKeyChange').mockImplementation(() => of(true));
    const setDashboardParamsSubscriptionSpy = jest.spyOn<any, any>(component, 'setDashboardParamsSubscription').mockImplementation();

    component.ngOnInit();

    expect(getErrorsMock).toHaveBeenCalledTimes(1);
    expect(setHeadersAndColumnsMock).toHaveBeenCalled();
    expect(getStatusesMock).toHaveBeenCalled();
    expect(errorTypeKeyChangeMock).toHaveBeenCalled();
    expect(setDashboardParamsSubscriptionSpy).toHaveBeenCalled();
  });

  it('should set current page and page size based on input values in ngOnInit', () => {
    jest.spyOn<any, any>(component, 'setDashboardParamsSubscription').mockImplementation();
    jest.spyOn(component, 'setHeadersAndColumns').mockImplementation();
    jest.spyOn(component, 'getStatuses').mockImplementation();
    jest.spyOn(component, 'getErrors').mockImplementation();
    jest.spyOn(component.errorService, 'errorTypeKeyChange').mockImplementationOnce(() => of(false)).mockImplementationOnce(() => of(true));
    component.jiraTicketState = {
      limit: 10,
      page: 1
    };
    component.ngOnInit();

    expect(component.pageSize).toBe(10);
    expect(component.currentPage).toBe(1);
  });

  it('should only show checkboxes and not do anything else if component is disabled', () => {
    component.disabled = true;
    component.fromTab = ErrorUrlTab.ALL;
    const getStatusesSpy = jest.spyOn(component, 'getStatuses').mockImplementation();

    component.ngOnInit();

    expect(component.showCheckboxes).toBeTruthy();
    expect(getStatusesSpy).toHaveBeenCalledTimes(0);
  });

  it('should check if old and new status are of same tab same or not', () => {
    const isSameTab: boolean = component['isSameTab'](ErrorConstants.ERROR_STATUS.CSR_ACTION, ErrorConstants.ERROR_STATUS.IN_PROGRESS);
    expect(isSameTab).toBeTruthy();
  });

  it('should set dashboard params subscription', () => {
    const getErrorsSpy = jest.spyOn(component, 'getErrors').mockImplementation();
    component['_dashboardService']['serviceHealthFilters'].next(NewErrorsList.DASHBOARD_PARAMS_INPUT);
    component['setDashboardParamsSubscription']();

    component['_dashboardService']['serviceHealthFilters'].subscribe((filters: IDashboardSearchFilters) => {
      expect(filters).toEqual(NewErrorsList.DASHBOARD_PARAMS_INPUT);
      expect(getErrorsSpy).toHaveBeenCalled();
    });
  });

  it('should check if checkboxes are disabled of enabled as per the error status', () => {
    let isEnabled = component.isCheckboxDisabled(errorDetailResult[0] as any);
    expect(isEnabled).toBe(true);
  });


  it('should check if all selectable errors are selected or not', () => {
    component.dataSource = new MatTableDataSource<IErrorDetail>(errorDetailResult as any);
    const getSelectedAndSelectableErrorsSpy = jest.spyOn<any, any>(component, 'getSelectedAndSelectableErrors')
      .mockImplementation(() => { return { selectableErrorIds: [], selectedErrorIds: [] } })
    expect(component.isAllSelected()).toBe(true);
    expect(getSelectedAndSelectableErrorsSpy).toHaveBeenCalled();
  });

  it('should get selected and selectable errors\' length and compare if their lengths are same', () => {
    component.dataSource = new MatTableDataSource<IErrorDetail>(errorDetailResult as any);
    expect(component.isAllSelected()).toBeTruthy();
  });

  it('should check if the error is selected or not', () => {
    expect(component.isChecked(errorDetailResult[0]._id)).toBe(false);
  });

  it('should show/hide the assignee dropdown when any of the checkbox is selected', () => {
    component.toggleAssigneeBulkUpdate();
    expect(component.isBulkAssigneeSelected).toBe(false);
  });

  it('should select all the checkbox within the view', () => {
    component.dataSource = new MatTableDataSource<IErrorDetail>(errorDetailResult as any);
    const getSelectedAndSelectableErrorsSpy = jest.spyOn<any, any>(component, 'getSelectedAndSelectableErrors')
      .mockImplementation(() => { return { selectableErrorIds: [], selectedErrorIds: [] } })

    component.onMasterCheckBoxClick();

    jest
      .spyOn(component, 'isCheckboxDisabled')
      .mockImplementation(() => false);

    expect(component.selectedBulkUpdateErrors.selected)
      .toEqual([]);
    expect(getSelectedAndSelectableErrorsSpy).toHaveBeenCalled();
  });

  it('should bulk assign the assignee to the errors', async () => {
    component.selectedBulkUpdateErrors.select(...ids);
    component.bulkUpdateAssignee = assignedTo;
    component.errorsTableData = errorDetailResult as any;
    jest
      .spyOn(errorService, 'bulkUpdateAssigneeErrorDetail')
      .mockImplementationOnce(() => of({ data: true }));
    const openSuccessSnackBar = jest
      .spyOn(sharedService, 'openSuccessSnackBar')

    const onCrossIconClickSpy = jest
      .spyOn(component, 'onCrossIconClick')

    await component.onBulkUpdateAssignee();
    expect(openSuccessSnackBar).toHaveBeenCalled();
    expect(onCrossIconClickSpy).toHaveBeenCalled();
  });

  it('should not assign error to bulk assignee', () => {
    jest
      .spyOn(errorService, 'bulkUpdateAssigneeErrorDetail')
      .mockImplementationOnce(() => of({ data: false }));
    const openSuccessSnackBar = jest
      .spyOn(sharedService, 'openSuccessSnackBar')

    component.onBulkUpdateAssignee();
    expect(openSuccessSnackBar).toHaveBeenCalledTimes(0);
  });

  it('should throw error while bulk assign the assignee to the errors', async () => {
    component.selectedBulkUpdateErrors.select(...ids);
    component.bulkUpdateAssignee = assignedTo;
    component.errorsTableData = errorDetailResult as any;

    jest
      .spyOn(errorService, 'bulkUpdateAssigneeErrorDetail')
      .mockImplementation(() => throwError(false));

    const openErrorSnackBar = jest
      .spyOn(sharedService, 'openErrorSnackBar')
      .mockImplementation();

    const onCrossIconClickSpy = jest
      .spyOn(component, 'onCrossIconClick')

    await component.onBulkUpdateAssignee();

    expect(openErrorSnackBar).toHaveBeenCalled();
    expect(onCrossIconClickSpy).toHaveBeenCalled();
  });

  it('should click the cross icon', () => {
    component.onCrossIconClick();
    expect(component.isBulkUpdateAssigneeLoading).toBe(false);
    expect(component.isBulkAssigneeSelected).toBe(false);
    expect(component.selectedBulkUpdateErrors.selected).toEqual([]);
    expect(component.bulkUpdateAssignee).toEqual({ id: "", name: "", avatar: "" });

  })

});
