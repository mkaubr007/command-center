import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomHttpService } from '../../../../../core/services/http.service';
import { IDashboardSearchFilters } from '../../../../../shared/models/dashboard/dashboard-search-filters.interface';
import { Daterange } from '../../../../../shared/models/date/daterange.model';
import {
  IErrorDetail,
  IErrorDetailCount,
  IErrorDetailResponse,
  IErrorDetailResponseData,
  IErrorDetailSearchFilter,
  IErrorsDetailResponse,
  IJiraState,
} from '../../../../../shared/models/error-detail/error-detail.interface';
import { ErrorDetail } from '../../../../../shared/models/error-detail/error-detail.model';
import {
  IErrorFilter,
  IErrorUser,
  IUserErrorCount,
} from '../../../../../shared/models/error/error.interface';
import { IMappedResponseData } from '../../../../../shared/models/response/mapped-response.interface';
import { ITeamOverview } from '../../../../../shared/models/team-member/team-member';
import { HomeDropdownConstants } from '../../../../shared-home/components/home-dropdown/home-dropdown.constants';
import { TeamService } from '../../../../team/team.service';
import { AuthService } from './../../../../../auth/auth.service';
import { LocalStorageConstants } from './../../../../../core/constants/local-storage.constants';
import { MessageConstant } from './../../../../../core/constants/message.constant';
import { RoleConstants } from './../../../../../core/constants/role.constant';
import { LocalStorageService } from './../../../../../core/services/local-storage.service';
import { ErrorUrlTab } from './../../../../../shared/enums/error-tab.enum';
import { ApiResponse } from './../../../../../shared/models/util/api-response';
import { ErrorConstants } from './shared/constants/error.constants';

@Injectable()
export class ErrorService {
  public totalErrorCount = new Subject<{ count: number; tabLabel: string }>();
  public getErrorsByFilter = new Subject<boolean>();
  public currentUserId: string;
  public currentSearchFilter = new Subject<IErrorDetailSearchFilter>();
  public teamOverviewRefresh = new Subject();

  public isRoleCSR = false;
  public isRoleAdminOrSupportUser = false;
  public searchByErrorTypeKey = '';
  public filterListData: IErrorFilter;
  public filterDateRange: Daterange = null;
  public errorUser: IErrorUser[] = [];
  private dashboardFilterMatch = {};

  public filterSelection = {
    name: [],
    status: [],
    assignee: this.errorUser,
  };

  private errorType = [
    { name: ErrorConstants.ERROR_TYPES.SUCCESS },
    { name: ErrorConstants.ERROR_TYPES.DATA_ERROR },
    { name: ErrorConstants.ERROR_TYPES.TEST_CSV },
    { name: ErrorConstants.ERROR_TYPES.MONGO_CONNECTION_ERROR },
    { name: ErrorConstants.ERROR_TYPES.SQL_CONNECTION_ERROR },
    { name: ErrorConstants.ERROR_TYPES.EMAIL_ERROR },
    { name: ErrorConstants.ERROR_TYPES.FILE_NAME_ERROR },
    { name: ErrorConstants.ERROR_TYPES.INFORMATION },
    { name: ErrorConstants.ERROR_TYPES.UNKNOWN_ERROR },
    { name: ErrorConstants.ERROR_TYPES.UNKNOWN_FILE_TYPE },
  ];

  private errorStatus = [
    { name: ErrorConstants.ERROR_STATUS.IN_PROGRESS },
    { name: ErrorConstants.ERROR_STATUS.CSR_ACTION },
    { name: ErrorConstants.ERROR_STATUS.PENDING },
    { name: ErrorConstants.ERROR_STATUS.TO_DO },
    { name: ErrorConstants.ERROR_STATUS.RESOLVED },
    { name: ErrorConstants.ERROR_STATUS.CLOSED },
  ];

  constructor(
    private http: CustomHttpService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private teamService: TeamService
  ) {
    this.setCurrentUserDetails();
    this.authService.onLogin().subscribe((_) => {
      this.setCurrentUserDetails();
    });
  }

  private setCurrentUserDetails(): void {
    const currentRole = this.localStorageService.getItemInLocalStorageWithoutJSON(
      LocalStorageConstants.ROLE
    );
    this.currentUserId = this.localStorageService.getItemInLocalStorageWithoutJSON(
      LocalStorageConstants.USER_ID
    );
    this.isRoleCSR =
      currentRole.toLowerCase() === RoleConstants.CLIENT_SERVICE_REPRESENTATIVE;
    this.isRoleAdminOrSupportUser = [
      RoleConstants.ADMIN,
      RoleConstants.SUPPORT_USER,
    ].includes(currentRole.toLowerCase());
  }

  public getErrorMatchCriteria(forTab: ErrorUrlTab) {
    let match = {};
    let csrMatch = {};
    let dateRangeMatch = {};

    if (this.isRoleCSR) {
      csrMatch = { csrId: this.currentUserId };
    }

    if (
      this.filterDateRange &&
      this.filterDateRange.startDate != null &&
      this.filterDateRange.endDate != null
    ) {
      const endDate = cloneDeep(this.filterDateRange.endDate);
      dateRangeMatch = {
        errorTimestamps: {
          $gte: this.filterDateRange.startDate,
          $lte: endDate.add(59, 'seconds'),
        },
      };
    }

    switch (forTab) {
      case ErrorUrlTab.UNRESOLVED_MANUAL:
        match = {
          status: {
            $in: [
              ErrorConstants.ERROR_STATUS.CSR_ACTION,
              ErrorConstants.ERROR_STATUS.IN_PROGRESS,
            ],
          },
          assignedTo: ErrorConstants.EXIST_TRUE_NOT_EQUAL_NULL,
          jiraTicketId: null,
        };
        break;
      case ErrorUrlTab.NEW:
        match = {
          status: ErrorConstants.ERROR_STATUS.PENDING,
        };
        break;
      case ErrorUrlTab.UNRESOLVED_JIRA:
        match = {
          $and: [
            { resolution: ErrorConstants.RESOLUTION.UNRESOLVED },
            { jiraTicketId: ErrorConstants.EXIST_TRUE },
          ],
        };
        break;
      case ErrorUrlTab.RESOLVED:
        match = {
          $or: [
            {
              status: {
                $in: [
                  ErrorConstants.ERROR_STATUS.RESOLVED,
                  ErrorConstants.ERROR_STATUS.DONE,
                ],
              },
            },
            {
              resolution: ErrorConstants.NOT_EQUAL_NULL,
            },
          ],
        };
        break;
      case ErrorUrlTab.ALL:
        match = {};
        break;
    }

    const filter = {
      ...(this.filterSelection.name &&
        this.filterSelection.name.length && {
          errorType: { $in: this.filterSelection.name },
        }),
      ...(this.filterSelection.status &&
        this.filterSelection.status.length && {
          status: { $in: this.filterSelection.status },
        }),
      ...(this.filterSelection.assignee &&
        this.filterSelection.assignee.length && {
          'assignedTo.id': {
            $in: this.filterSelection.assignee.map((data) => data.id),
          },
        }),
    };

    return {
      ...match,
      ...csrMatch,
      ...filter,
      ...dateRangeMatch,
      ...this.dashboardFilterMatch,
    };
  }

  public setDashboardFilterMatch(filters: IDashboardSearchFilters): void {
    let clientNames = [];
    let environments = [];
    let serviceNames = [];
    this.dashboardFilterMatch = {};

    if (
      filters.clientNames.includes(
        HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS[0].name
      )
    ) {
      if (this.teamService.distinctClients.length > 1) {
        clientNames = this.teamService.distinctClients
          .map((client) => client.name)
          .filter(
            (client) =>
              client !== HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS[0].name
          );
      }
    } else {
      clientNames = filters.clientNames;
    }

    if (
      filters.environments.includes(
        HomeDropdownConstants.DEFAULT_SELECTED_ENVIRONMENTS[0].name
      )
    ) {
      this.dashboardFilterMatch['isPrioritized'] = true;
    } else if (
      filters.environments.includes(
        HomeDropdownConstants.ALL_ENVIRONMENTS[0].name
      )
    ) {
      if (this.teamService.distinctEnvironments.length > 2) {
        environments = this.teamService.distinctEnvironments
          .filter(
            (env) =>
              env !== HomeDropdownConstants.ALL_ENVIRONMENTS[0] &&
              env !== HomeDropdownConstants.DEFAULT_SELECTED_ENVIRONMENTS[0]
          )
          .map((env) => env.name);
      }
    } else {
      environments = filters.environments as string[];
    }

    if (
      filters.services.includes(
        HomeDropdownConstants.DEFAULT_SELECTED_SERVICES[0].name
      )
    ) {
      if (this.teamService.distinctServices.length > 1) {
        serviceNames = this.teamService.distinctServices
          .filter(
            (env) => env !== HomeDropdownConstants.DEFAULT_SELECTED_SERVICES[0]
          )
          .map((service) => service.name);
      }
    } else {
      serviceNames = filters.services as string[];
    }

    this.dashboardFilterMatch['clientName'] = { $in: clientNames };
    this.dashboardFilterMatch['environment'] = { $in: environments };
    this.dashboardFilterMatch['serviceName'] = { $in: serviceNames };
  }

  public getPaginatorText(forTab: ErrorUrlTab): string {
    let text: string;

    switch (forTab) {
      case ErrorUrlTab.UNRESOLVED_MANUAL:
        text = MessageConstant.PAGINATION_UNRESOLVED_MANUAL;
        break;
      case ErrorUrlTab.NEW:
        text = MessageConstant.PAGINATION_NEW;
        break;
      case ErrorUrlTab.UNRESOLVED_JIRA:
        text = MessageConstant.PAGINATION_UNRESOLVED_JIRA;
        break;
      case ErrorUrlTab.RESOLVED:
        text = MessageConstant.PAGINATION_RESOLVED;
        break;
      case ErrorUrlTab.ALL:
        text = MessageConstant.PAGINATION_ALL;
        break;
    }

    return text;
  }

  public onSearchByErrorChange(key: string, doRefresh = true): void {
    this.searchByErrorTypeKey = key;
    this.getErrorsByFilter.next(doRefresh);
  }

  public getErrorTypeSearch(): string {
    return this.searchByErrorTypeKey;
  }

  public setDateRange(dateRange: Daterange): void {
    this.filterDateRange = dateRange;
    this.getErrorsByFilter.next(true);
  }

  //in the future we will be referring to localstorage service to get role and csrId to reduce number of params
  public getErrors(
    sortBy?: string,
    orderBy?: number,
    limit?: number,
    page?: number,
    match?: any,
    searchBy?: string,
    tab?: string
  ): Observable<IErrorDetailResponseData> {
    if (searchBy && searchBy.length) {
      searchBy = encodeURIComponent(searchBy);
    }

    let csrId = '';

    if (this.isRoleCSR) {
      csrId = this.currentUserId;
    }

    const params = {
      limit,
      status,
      orderBy,
      sortBy,
      page,
      searchBy,
      match: JSON.stringify(match),
      tab,
      csrId,
    };
    this.currentSearchFilter.next({
      match: JSON.stringify(match),
      searchBy,
      orderBy,
      sortBy,
    });

    // need to remove all http calls to a service
    return this.http.get<IErrorsDetailResponse>(`/error-details`, params).pipe(
      map(
        (
          response: HttpResponse<IMappedResponseData<IErrorDetailResponseData>>
        ) => {
          let errors = {
            result: [],
            count: 0,
            page: 1,
            totalCount: 0,
          };

          if (
            response.body.data &&
            response.body.data.result &&
            response.body.data.result.length
          ) {
            const errorsList = response.body.data.result.map(
              (value: IErrorDetail) => {
                return new ErrorDetail(value);
              }
            );
            errors = {
              result: errorsList,
              count: response.body.data.count,
              page: response.body.data.page,
              totalCount: response.body.data.totalCount,
            };
          }
          return errors;
        }
      )
    );
  }

  public getCurrentSearch(): Observable<IErrorDetailSearchFilter> {
    return this.currentSearchFilter.asObservable();
  }

  public triggerTeamOverviewRefresh(): void {
    this.teamOverviewRefresh.next();
  }

  public refreshTeamOverview(): Observable<any> {
    return this.teamOverviewRefresh.asObservable();
  }

  public updateErrorDetail(
    id: string,
    errorDetail: Partial<IErrorDetail>,
    options = {}
  ): Observable<IErrorDetailResponse> {
    let params = new HttpParams();

    for (const key in options) {
      params = params.set(key.toString(), options[key].toString());
    }

    return this.http.put<IErrorDetailResponse>(
      `/error-details/${id}`,
      errorDetail,
      '',
      false,
      params
    );
  }

  public bulkUpdateAssigneeErrorDetail(
    ids: string[],
    assignedTo
  ): Observable<ApiResponse<boolean>> {
    let params = new HttpParams();
    params = params.set('ids', ids.toString());
    const assignedBy = this.authService.getUserData();
    
    return this.http.put<ApiResponse<boolean>>(
      `/error-details/bulk-update-assignee/`,
      {assignedTo, assignedBy},
      '',
      false,
      params
    );
  }

  public getErrorCount(): Observable<IErrorDetailCount> {
    let csrId = '';

    if (this.isRoleCSR) {
      csrId = this.currentUserId;
    }
    const params = { csrId, match: JSON.stringify(this.dashboardFilterMatch) };
    return this.http
      .get<IErrorDetailResponse>(`/error-details/count`, params)
      .pipe(
        map(
          (response: HttpResponse<IMappedResponseData<IErrorDetailCount>>) => {
            return response.body.data;
          }
        )
      );
  }

  public getTeamMemberOverview(): Observable<ITeamOverview[]> {
    let csrId = '';

    if (this.isRoleCSR) {
      csrId = this.currentUserId;
    }
    const params = { csrId, match: JSON.stringify(this.dashboardFilterMatch) };
    return this.http
      .get<ApiResponse<ITeamOverview[]>>(`/error-details/team-overview`, params)
      .pipe(
        map(
          (response: HttpResponse<IMappedResponseData<ITeamOverview[]>>) => {
            return response.body.data;
          }
        )
      );
  }

  public getSerializeJiraState(state: IJiraState): string {
    let serializeState = '';
    for (const key in state) {
      if (!serializeState) {
        serializeState = `${key}:${state[key]}`;
      } else {
        serializeState = `${serializeState};${key}:${state[key]}`;
      }
    }
    return serializeState;
  }

  public getTotalErrorCount(): Observable<{ count: number; tabLabel: string }> {
    return this.totalErrorCount.asObservable();
  }

  public errorTypeKeyChange(): Observable<boolean> {
    return this.getErrorsByFilter.asObservable();
  }

  public getUnresolvedErrorAndCsrCountForUser(
    memberId: string,
    isCsrUser: boolean
  ): Observable<IUserErrorCount> {
    const params = { userId: memberId, isCsrUser: isCsrUser.toString() };
    return this.http
      .get<IErrorDetailResponse>(
        `/error-details/unresolved-error-and-csr-count`,
        params
      )
      .pipe(
        map((response: HttpResponse<ApiResponse<IUserErrorCount>>) => {
          return response.body.data;
        })
      );
  }

  public async updateFilterList(tab: string): Promise<void> {
    this.filterListData = {};
    this.filterSelection = {
      name: [],
      status: [],
      assignee: [],
    };
    let csrId;

    if (this.isRoleCSR) {
      csrId = this.currentUserId;
    }

    this.filterListData = await this.getFilterList(tab, csrId);
  }

  public async getFilterList(
    tab: string,
    csrId: string
  ): Promise<IErrorFilter> {
    let status = this.errorStatus;
    const type = cloneDeep(this.errorType);

    switch (tab) {
      case ErrorUrlTab.NEW:
        status = [{ name: ErrorConstants.ERROR_STATUS.PENDING }];
        break;
      case ErrorUrlTab.UNRESOLVED_MANUAL:
        status = [
          { name: ErrorConstants.ERROR_STATUS.IN_PROGRESS },
          { name: ErrorConstants.ERROR_STATUS.CSR_ACTION },
        ];
        break;
      case ErrorUrlTab.RESOLVED:
        status = [
          { name: ErrorConstants.ERROR_STATUS.RESOLVED },
          { name: ErrorConstants.ERROR_STATUS.DONE },
        ];
        break;
      case ErrorUrlTab.UNRESOLVED_JIRA:
        status = [{ name: ErrorConstants.ERROR_STATUS.TO_DO }];
        break;
    }

    const { assignee } = await this.fetchAssigneeFilterList(csrId).toPromise();

    return { type, status, assignee };
  }

  private fetchAssigneeFilterList(csrId: string): Observable<{ assignee?: IErrorUser[] }> {
    return this.http
      .get<ApiResponse<{ assignee: IErrorUser[] }>>(`/error-details/filters`, { csrId })
      .pipe(
        map(
          (response: HttpResponse<IMappedResponseData<{ assignee?: IErrorUser[] }>>) => {
            return response.body.data;
          }
        )
      )
  }

  public getErrorDetail(errorId: string): Observable<IErrorDetail> {
    return this.http
      .get<{
        data: { errorType: IErrorDetail };
        statusCode: number;
        message: string;
      }>(`/error-details/${errorId}`)
      .pipe(
        map((response) => {
          return response['body']['data'];
        })
      );
  }
}
