import { HomeDropdownConstants } from './../shared-home/components/home-dropdown/home-dropdown.constants';
import {
  IClient,
  IClientsResponse,
  IClientResponseData,
  IClientServiceRep,
  IClientServiceResponse,
  IEnvironments,
  IClientEnvResponse,
  IClientResponse,
  IService,
  IServiceResponse,
} from './../../shared/models/client-service-rep/client-service-rep';
import { Injectable } from '@angular/core';
import { CustomHttpService } from '../../core/services/http.service';
import { map } from 'rxjs/operators';
import {
  CreatedByRole,
  TeamMember,
  TeamMemberResponse,
} from '../../shared/models/team-member/team-member.model';
import { Observable, of, Subject } from 'rxjs';
import {
  IProfileData,
  IAddTeamMember,
  ICreatedByRole,
  IProfileParam,
  ITeamMember,
  ITeamMemberParam,
} from '../../shared/models/team-member/team-member';
import { Clients } from '../../shared/models/client-service-rep/clients.model';
import { RouteConstants } from '../../core/constants/route.constants';
import { cloneDeep } from 'lodash';
import { IArrFieldUpdate } from '../../shared/models/util/arrfieldupdate.interface';
import { Service } from '../../shared/models/service/service.model';
import { LocalStorageConstants } from '../../core/constants/local-storage.constants';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { ApiResponse } from 'src/app/shared/models/util/api-response';
import { IDistinctName } from '../../shared/models/util/i-distinct-name.interface';
import { INameCount } from '../../shared/models/dashboard/i-name-count.interface';

@Injectable()
export class TeamService {
  isMemberAdded: boolean;
  public inputValue = new Subject<any>();
  public distinctClients: IDistinctName[] = HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS;
  public distinctEnvironments: INameCount[] = HomeDropdownConstants.DEFAULT_ENVIRONMENTS;
  public distinctServices: INameCount[] = HomeDropdownConstants.DEFAULT_SELECTED_SERVICES;
  constructor(
    private http: CustomHttpService,
    private localStorageService: LocalStorageService
  ) { }

  public getMemberRoles(): Observable<ICreatedByRole[]> {
    return this.http
      .get<{
        data: ICreatedByRole[];
      }>('/roles')
      .pipe(
        map((response) => {
          return response['body']['data'].map(
            (memberRoles: CreatedByRole) => new CreatedByRole(memberRoles)
          );
        })
      );
  }

  public uploadProfile(uploadedFile: FormData): Promise<IProfileParam> {
    return this.http
      .post<{
        data: IProfileData;
        message: string;
        statusCode: number;
      }>('/s3-api/upload-image?uploadType=image', uploadedFile)
      .toPromise();
  }

  public addTeamMember(memberData: TeamMember): Observable<IAddTeamMember> {
    memberData.redirectUrlForMail = window.location.origin;
    memberData.createdBy.email = this.localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.EMAIL);
   return this.http.post<IAddTeamMember>('/users', memberData);
  }

  public updateTeamMember(
    memberData: TeamMember,
    id: string
  ): Observable<IAddTeamMember> {
    return this.http.put(`/users/${id}`, memberData);
  }

  public getTeamMembers(
    sort_by: string,
    order_by: number,
    limit: number,
    page: number
  ): Observable<TeamMemberResponse> {
    const params = { limit, order_by, sort_by, page };

    return this.http
      .get<ITeamMemberParam>(`/users`, params)
      .pipe(
        map((response) => {
          const teamMember = response['body']['data']['result'].map(
            (value: ITeamMember) => new TeamMember(value)
          );
          const result = {
            result: teamMember,
            count: response['body']['data']['count'],
          };
          return result;
        })
      );
  }

  public searchTeamMembers(
    match: any,
    projection: any,
    sort: any
  ): Observable<IClientServiceRep[]> {
    const params = {
      match: JSON.stringify(match),
      projection: JSON.stringify(projection),
      sort: JSON.stringify(sort),
    };

    return this.http
      .get<IClientServiceResponse>(`/users/all`, params)
      .pipe(
        map((response) => {
          return response['body']['data'];
        })
      );
  }

  public createClient(client: IClient): Observable<ApiResponse<IClientServiceResponse>> {
    return this.http.post<ApiResponse<IClientServiceResponse>>(`/clients`, {
      client,
      redirectUrl: `${window.location.origin}/${RouteConstants.LOGIN}`,
    });
  }

  public updateEnvironment(clientId: string, params: IArrFieldUpdate): Observable<ApiResponse<IClientEnvResponse>> {
    return this.http.put<ApiResponse<IClientEnvResponse>>(`/clients/${clientId}/environment`, params);
  }

  public getClients(
    sort_by?: string,
    order_by?: number,
    limit?: number,
    page?: number,
    searchText = ''
  ): Observable<IClientResponseData> {
    const params = { sort_by, order_by, limit, page, searchText };

    return this.http
      .get<IClientsResponse>(`/clients`, params)
      .pipe(
        map((response) => {
          const clientsList = response['body']['data']['result'].map(
            (value: IClient) => {
              return new Clients(value);
            }
          );
          const clients = {
            result: clientsList,
            count: response['body']['data']['count'],
          };
          return clients;
        })
      );
  }

  public getDistinctClients(csrId: string): Observable<IDistinctName[]> {
    if (this.distinctClients.length > 1) {
      return of(this.distinctClients);
    } else {
      return this.http
        .get<{
          data: string[];
        }>('/clients/distinct/clients', { csrId })
        .pipe(
          map((response) => {
            this.distinctClients = this.distinctClients.concat(response['body']['data']);
            return this.distinctClients;
          })
        );
    }
  }

  public getDistinctEnvironments(csrId: string): Observable<INameCount[]> {
    if (this.distinctEnvironments.length > 2) {
      return of(this.distinctEnvironments);
    } else {
      return this.http
        .get<{
          data: string[];
        }>('/clients/distinct/environments', { csrId })
        .pipe(
          map((response) => {
            this.distinctEnvironments = this.distinctEnvironments.concat(response['body']['data']);
            return this.distinctEnvironments;
          })
        );
    }
  }

  public getDistinctServices(csrId: string): Observable<INameCount[]> {
    if (this.distinctServices.length > 1) {
      return of(this.distinctServices);
    } else {
      return this.http
        .get<{
          data: string[];
        }>('/clients/distinct/services', { csrId })
        .pipe(
          map((response) => {
            this.distinctServices = this.distinctServices.concat(response['body']['data']);
            return this.distinctServices;
          })
        );
    }
  }

  public getServices(): Observable<IService[]> {
    return this.http
      .get<{
        data: IService[];
      }>('/services')
      .pipe(
        map((response) => {
          return response['body']['data'].map(
            (services: Service) => new Service(services)
          );
        })
      );
  }

  public addEnvironment(
    environment: IEnvironments,
    clientId: string
  ): Observable<IClientResponse> {
    return this.http.post(`/clients/${clientId}/environment`, environment);
  }

  public createService(service: IService): Observable<IServiceResponse> {
    return this.http.post<IServiceResponse>(`/services`, service);
  }

  public updateClient(clientId: string, client: IClient): Observable<IClientResponse> {
    if('team' in client) {
      delete client['team'];
    }
    return this.http.put<IClientResponse>(`/clients/${clientId}`, client);
  }

  public searchByTeamMemberUserNameOrEmail(
    searchTeamMemberParams: any
  ): Observable<TeamMemberResponse> {
    const searchParams = cloneDeep(searchTeamMemberParams);
    searchParams.userEmailId = this.localStorageService.getItemInLocalStorageWithoutJSON(
      LocalStorageConstants.EMAIL
    );
    return this.http
      .get<TeamMemberResponse>(
        '/users/find', { searchParams: JSON.stringify(searchParams) }
      )
      .pipe(
        map(({ body }) => body),
        map((response) => {
          const teamMember = response['data']['result'].map(
            (value: ITeamMember) => new TeamMember(value)
          );
          const result = {
            result: teamMember,
            count: response['data']['count'],
          };
          return result;
        })
      );
  }

  public getInputValue(): Observable<any> {
    return this.inputValue.asObservable();
  }
}
