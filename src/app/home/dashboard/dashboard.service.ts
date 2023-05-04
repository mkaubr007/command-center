import { RoleConstants } from './../../core/constants/role.constant';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isEmpty } from "lodash";
import { LocalStorageConstants } from '../../core/constants/local-storage.constants';
import { CustomHttpService } from '../../core/services/http.service';
import { IClientServiceErrorMap } from '../../shared/models/client/client-service-error-map.interface';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { IDashboardSearchFilters } from '../../shared/models/dashboard/dashboard-search-filters.interface';
import { HomeDropdownConstants } from '../shared-home/components/home-dropdown/home-dropdown.constants';
import { HttpResponse } from '@angular/common/http';
import { IMappedResponseData } from 'src/app/shared/models/response/mapped-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private serviceHealthFilters: BehaviorSubject<IDashboardSearchFilters> = new BehaviorSubject<IDashboardSearchFilters>(undefined);


  constructor(
    private _http: CustomHttpService,
    private localStorageService: LocalStorageService,
  ) { }

  public getPrioritisedEnvironmentServices(params: IDashboardSearchFilters= {}): Observable<IClientServiceErrorMap[]> {
    if(isEmpty(params)) {
      params = {
        clients: HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS.map(client => client._id),
        environments : HomeDropdownConstants.DEFAULT_SELECTED_ENVIRONMENTS.map(env => env.name),
        services: HomeDropdownConstants.DEFAULT_SELECTED_SERVICES.map(service => service.name)
      }
    }
    const role = this.localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.ROLE);

    if (role.toLowerCase() === RoleConstants.CLIENT_SERVICE_REPRESENTATIVE) {
      params.csrId = this.localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID);
    }

    return this._http
      .get<{ data: IClientServiceErrorMap[] }>('/clients/prioritised-environment-services', { params: JSON.stringify(params) })
      .pipe(
        map((response: HttpResponse<IMappedResponseData<IClientServiceErrorMap[]>>) => {
          return response.body.data;
        })
      );
  }

  public setDashboardFilters(filters: IDashboardSearchFilters): void {
  	this.serviceHealthFilters.next(filters);
  }

  public getDashboardFilters(): Observable<IDashboardSearchFilters> {
    return this.serviceHealthFilters.asObservable();
  }
}
