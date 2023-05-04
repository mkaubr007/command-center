import { ApiResponse } from './../../../../../shared/models/util/api-response';
import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import { ErrorDetail } from 'src/app/shared/models/error-detail/error-detail.model';
import { AuthService } from '../../../../../auth/auth.service';
import { CustomHttpService } from '../../../../../core/services/http.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { IErrorDetailResponseData } from '../../../../../shared/models/error-detail/error-detail.interface';
import { IMappedResponseData } from '../../../../../shared/models/response/mapped-response.interface';
import { ErrorService } from './error.service';
import { MockAuthService } from '../../../../../auth/mock-auth.service';
import { NewErrorsList } from './shared/constants/errors-test.constants';
import { LocalStorageConstants } from '../../../../../core/constants/local-storage.constants';
import { RoleConstants } from '../../../../../core/constants/role.constant';
import { TeamService } from '../../../../team/team.service';
import { ids, assignedTo, filterData } from "./error.service.spec.data.json";
import { TeamOverViewConstants } from '../team-overview/team-overview.constants';
import { INameCount } from '../../../../../shared/models/dashboard/i-name-count.interface';
import { IDistinctName } from '../../../../../shared/models/util/i-distinct-name.interface';
import { HomeDropdownConstants } from '../../../../shared-home/components/home-dropdown/home-dropdown.constants';
const moment = require('moment').default || require('moment');
import { ErrorUrlTab } from '../../../../../shared/enums/error-tab.enum';
import { ErrorConstants } from './shared/constants/error.constants';

class CustomHttpServiceMock {
  get(): Observable<any> {
    return of(new HttpResponse<IMappedResponseData<IErrorDetailResponseData[]>>({ 'body': { 'data': [] } }));
  }

  put(): Observable<ApiResponse<boolean>> {
    return of(({ data: true }));
  }
}

class MockTeamService {
  public distinctClients: IDistinctName[] = HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS;
  public distinctEnvironments: INameCount[] = HomeDropdownConstants.DEFAULT_ENVIRONMENTS;
  public distinctServices: INameCount[] = HomeDropdownConstants.DEFAULT_SELECTED_SERVICES;
}

describe('ErrorService', () => {
  let service: ErrorService;
  let customHttpService: CustomHttpService;
  let localStorage: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({

      providers: [
        { provide: TeamService, useClass: MockTeamService },
        ErrorService,
        { provide: CustomHttpService, useClass: CustomHttpServiceMock },
        LocalStorageService,
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
    localStorage = TestBed.inject(LocalStorageService);
    localStorage
      .setItemInLocalStorageWithoutJSON(LocalStorageConstants.ROLE, RoleConstants.CLIENT_SERVICE_REPRESENTATIVE);
    localStorage
      .setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, NewErrorsList.USER_ID);

    service = TestBed.inject(ErrorService);
    customHttpService = TestBed.inject(CustomHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getErrors()', () => {
    jest
      .spyOn(customHttpService, 'get')
      .mockImplementation(() => of(new HttpResponse({ 'body': { 'data': { 'result': [new ErrorDetail()] } } })));

    service.getErrors().subscribe(response => {
      expect(response).toBeDefined();
    })
  });


  it('getErrorsCount()', async () => {
    jest
      .spyOn(customHttpService, 'get')
      .mockImplementation(() => of(new HttpResponse({ 'body': { 'data': { 'result': [new ErrorDetail()] } } })))

    service.getErrorCount().subscribe(response => {
      expect(response).toBeDefined();
    });

  });

  it('get filter data', async () => {
    jest
      .spyOn(customHttpService, 'get')
      .mockImplementation(() => of(new HttpResponse({ body: { data: { type: NewErrorsList.LIST_DATA } } })));

    expect(await service.getFilterList(NewErrorsList.JIRA_MANUAL_ERROR_STATE.tab, null)).toBeDefined();
  });

  it('get filter data', async () => {
    jest
      .spyOn(customHttpService, 'get')
      .mockImplementation(() => of(new HttpResponse({ body: { data: { assignee: NewErrorsList.LIST_DATA } } })));

    const getFilterListSpy = jest
      .spyOn(service, 'getFilterList')
      .mockImplementation(() => of(NewErrorsList.FILTER_SELECTION).toPromise())
    await service.updateFilterList(NewErrorsList.JIRA_MANUAL_ERROR_STATE.tab);
    expect(getFilterListSpy).toHaveBeenCalledWith(NewErrorsList.JIRA_MANUAL_ERROR_STATE.tab, NewErrorsList.USER_ID);
    expect(service.filterListData.assignee).toEqual([]);
  });

  it('should set params coming from dashboard', () => {
    service['teamService'].distinctClients = HomeDropdownConstants.DISTINCT_CLIENTS;
    service['teamService'].distinctEnvironments = HomeDropdownConstants.DISTINCT_ENVIRONMENTS;
    service['teamService'].distinctServices = HomeDropdownConstants.DISTINCT_SERVICES;

    service.setDashboardFilterMatch(NewErrorsList.DASHBOARD_PARAMS_INPUT);

    expect(service['dashboardFilterMatch']).toEqual(NewErrorsList.DASHBOARD_PARAMS_OUTPUT);
  });

  it('should bulk update the assignee of ErrorDetail', async () => {
    const getUserDataSpy = jest.spyOn<any, any>(service['authService'],'getUserData').mockImplementation();
    const result = await service.bulkUpdateAssigneeErrorDetail(ids, assignedTo).toPromise();
    expect(result).toEqual({ data: true })
    expect(getUserDataSpy).toHaveBeenCalled();
  });

  it('getErrorsCount()', async () => {
    jest
      .spyOn(customHttpService, 'get')
      .mockImplementation(() => of(new HttpResponse({ 'body': { 'data': { 'errorCount': 1 } } })))

    service.getUnresolvedErrorAndCsrCountForUser("test", true).subscribe(response => {
      expect(response).toBeDefined();
    });

  });

  it('should fetch assignee filter list if present in local-storage', async () => {
    jest
      .spyOn(service['localStorageService'], 'getLocalStorage')
      .mockImplementation(() => filterData);

    jest.spyOn<any, any>(service,'fetchAssigneeFilterList').mockImplementation(() => of(filterData) );

    const { assignee } = await service.getFilterList(null, null);
    expect({ assignee }).toEqual(filterData);
  });

  it('should fetch assignee filter list if not present in local-storage', async () => {
    jest
      .spyOn(service['http'], 'get')
      .mockImplementation(() => of(new HttpResponse({ body: { data: filterData } })));

    jest
      .spyOn(service['localStorageService'], 'getLocalStorage')
      .mockImplementation(() => null);

    jest
      .spyOn(service['localStorageService'], 'setItemInLocalStorageWithoutJSON')
      .mockImplementation();
    const { assignee } = await service.getFilterList(null, null);

    expect({ assignee }).toEqual(filterData);
  });

  it('should get team member overview', async () => {
    jest
      .spyOn(customHttpService, 'get')
      .mockImplementation(() => of(new HttpResponse({ 'body': { 'data': TeamOverViewConstants.TEAMOVERVIEW_LIST } })))

    service.getTeamMemberOverview().subscribe(response => {
      expect(response).toEqual(TeamOverViewConstants.TEAMOVERVIEW_LIST)
    });
  });

  it('should trigger team overview refresh on status or assignee change', () => {
    const triggerTeamOverviewRefreshSpy = jest.spyOn(service.teamOverviewRefresh, 'next').mockImplementation();

    service.triggerTeamOverviewRefresh();

    expect(triggerTeamOverviewRefreshSpy).toHaveBeenCalled();
  });

  it('should return subjest for teamOverview to subscribe to and refresh team overview data', () => {
    const sub$ = new Subject().asObservable();

    const result = service.refreshTeamOverview();

    expect(result).toEqual(sub$);
  });

  it('should get error match criteria for unresolved manual error tab', async () => {
    service.isRoleCSR = false;
    service.filterSelection = {
      name: [],
      status: [],
      assignee: ErrorConstants.ASSIGNEES
    };
    service.filterDateRange = {
      startDate: moment(new Date()),
      endDate: moment(new Date())
    };

    const unresolvedMatch = await service.getErrorMatchCriteria(ErrorUrlTab.UNRESOLVED_MANUAL);
    
    expect(unresolvedMatch).toBeDefined();
  });

  it('should get error match criteria for unresolved manual error tab', async () => {
    service.isRoleCSR = false;
    service.filterSelection = {
      name: [],
      status: [],
      assignee: ErrorConstants.ASSIGNEES
    };
    service.filterDateRange = {
      startDate: moment(new Date()),
      endDate: moment(new Date())
    };

    const unresolvedJiraMatch = await service.getErrorMatchCriteria(ErrorUrlTab.UNRESOLVED_JIRA);
    expect(unresolvedJiraMatch).toBeDefined();
  });

  it('should get error match criteria for unresolved manual error tab', async () => {
    service.isRoleCSR = false;
    service.filterSelection = {
      name: [],
      status: [],
      assignee: ErrorConstants.ASSIGNEES
    };
    service.filterDateRange = {
      startDate: moment(new Date()),
      endDate: moment(new Date())
    };

    const resolvedMatch = await service.getErrorMatchCriteria(ErrorUrlTab.RESOLVED);
    expect(resolvedMatch).toBeDefined();
  });

  it('should get error match criteria for all error tab', async () => {
    service.isRoleCSR = false;
    service.filterSelection = {
      name: [],
      status: [],
      assignee: ErrorConstants.ASSIGNEES
    };
    service.filterDateRange = {
      startDate: moment(new Date()),
      endDate: moment(new Date())
    };

    const allErrorMatch = await service.getErrorMatchCriteria(ErrorUrlTab.ALL);
    expect(allErrorMatch).toBeDefined();
  });

});
