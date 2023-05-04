import { IDistinctName } from './../../../../shared/models/util/i-distinct-name.interface';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomHttpService } from '../../../../core/services/http.service';
import { MaterialModule } from '../../../../material/material.module';
import { TeamService } from '../../../team/team.service';
import { SharedHomeModule } from '../../shared-home.module';

import { HomeDropdownComponent } from './home-dropdown.component';
import { HomeDropdownConstants } from './home-dropdown.constants';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { ErrorService } from '../../../dashboard/shared/components/errors-tab/error.service';
import { AuthService } from '../../../../auth/auth.service';
import { CacheService } from '../../../cache-service';
import { SocketService } from '../../services/socket/socket.service';
import { LocalStorageConstants } from '../../../../core/constants/local-storage.constants';
import { RoleConstants } from '../../../../core/constants/role.constant';
import { INameCount } from '../../../../shared/models/dashboard/i-name-count.interface';
import { MockSocketService } from '../../services/socket/socket-service.mock';
import { cloneDeep } from 'lodash';

class TeamServiceMock extends TeamService {
  getDistinctClients(): Observable<IDistinctName[]> {
    return of(HomeDropdownConstants.DISTINCT_CLIENTS);
  }
  getDistinctEnvironments(): Observable<INameCount[]> {
    return of(HomeDropdownConstants.DISTINCT_ENVIRONMENTS);
  }
  getDistinctServices(): Observable<INameCount[]> {
    return of(HomeDropdownConstants.DISTINCT_SERVICES);
  }
}
describe('HomeDropdownComponent', () => {
  let component: HomeDropdownComponent;
  let fixture: ComponentFixture<HomeDropdownComponent>;
  let localStorageService: LocalStorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        NgSelectModule,
        CommonModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedHomeModule,
        RouterTestingModule,
      ],
      declarations: [],
      providers: [
        CustomHttpService,
        { provide: TeamService, useClass: TeamServiceMock },
        LocalStorageService,
        ErrorService,
        AuthService,
        CacheService,
        { provide: SocketService, useClass: MockSocketService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    localStorageService = TestBed.inject(LocalStorageService);
    localStorageService.setItemInLocalStorageWithoutJSON(LocalStorageConstants.ROLE, RoleConstants.ADMIN);
    fixture = TestBed.createComponent(HomeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () => {
    const getClientNamesSpy = jest.spyOn(component,'getClientNames').mockImplementation();
    const getEnvironmentNamesSpy = jest.spyOn(component,'getEnvironmentNames').mockImplementation();
    const getServiceNamesSpy = jest.spyOn(component,'getServiceNames').mockImplementation();
    const setSocketSubscriptionSpy = jest.spyOn<any, any>(component,'setSocketSubscription').mockImplementation();

    component.ngOnInit();

    expect(getClientNamesSpy).toHaveBeenCalled();
    expect(setSocketSubscriptionSpy).toHaveBeenCalled();
    expect(getEnvironmentNamesSpy).toHaveBeenCalled();
    expect(getServiceNamesSpy).toHaveBeenCalled();

  });

  it('should get client names', ()=> {
    component['csrId'] = HomeDropdownConstants.CSRID;
    const getClientNamesSpy = jest.spyOn(component['_teamService'],'getDistinctClients').mockImplementation(()=> of(HomeDropdownConstants.DISTINCT_CLIENTS));
    component.getClientNames();

    expect(getClientNamesSpy).toHaveBeenCalled();
    expect(component.clients).toEqual(HomeDropdownConstants.DISTINCT_CLIENTS);
  });

  it('should get environment names', ()=> {
    component['csrId'] = HomeDropdownConstants.CSRID;
    const getEnvironmentNamesSpy = jest.spyOn(component['_teamService'],'getDistinctEnvironments').mockImplementation(()=> of(HomeDropdownConstants.DISTINCT_ENVIRONMENTS));
    component.getEnvironmentNames();

    expect(getEnvironmentNamesSpy).toHaveBeenCalled();
    expect(component.environments).toEqual(HomeDropdownConstants.DISTINCT_ENVIRONMENTS);
  });

  it('should get service names', ()=> {
    component['csrId'] = HomeDropdownConstants.CSRID;
    const getServiceNamesSpy = jest.spyOn(component['_teamService'],'getDistinctServices').mockImplementation(()=> of(HomeDropdownConstants.DISTINCT_SERVICES));
    component.getServiceNames();

    expect(getServiceNamesSpy).toHaveBeenCalled();
    expect(component.services).toEqual(HomeDropdownConstants.DISTINCT_SERVICES);
  });

  it('should change selected clients', ()=> {
    component.onClientChange(HomeDropdownConstants.DISTINCT_CLIENTS);

    expect(component.selectedClients).toEqual(HomeDropdownConstants.DISTINCT_CLIENTS);
  });

  it('should change selected environments', ()=> {
    component.onEnvironmentChange(HomeDropdownConstants.DISTINCT_ENVIRONMENTS);

    expect(component.selectedEnvironments).toEqual(HomeDropdownConstants.DISTINCT_ENVIRONMENTS);
  });

  it('should change selected services', ()=> {
    component.onServiceChange(HomeDropdownConstants.DISTINCT_SERVICES);

    expect(component.selectedServices).toEqual(HomeDropdownConstants.DISTINCT_SERVICES);
  });

  it('should apply dashboard filters', ()=> {
    component.selectedClients = HomeDropdownConstants.DISTINCT_CLIENTS;
    component.selectedEnvironments = cloneDeep(HomeDropdownConstants.DISTINCT_ENVIRONMENTS);
    component.selectedServices = HomeDropdownConstants.DISTINCT_SERVICES;
    const setDashboardFiltersSpy = jest.spyOn(component['_dashboardService'],'setDashboardFilters');

    component.applyFilter();
    
    expect(setDashboardFiltersSpy).toHaveBeenCalledWith(HomeDropdownConstants.DASHBOARD_FILTERS);
  });

  it('should set socket subscription', () => {
    const onDeactivatedClientSpy = jest.spyOn(component['_socketService'], 'onDeactivatedClient').mockImplementation(() => {
      return of(HomeDropdownConstants.DEACTIVATED_CLIENT);
    });

    const activateClientSpy = jest.spyOn(component['_socketService'], 'activateClient').mockImplementation(() => {
      return of(HomeDropdownConstants.ACTIVATED_CLIENT);
    });
    const updateListingSpy = jest.spyOn<any, any>(component, 'updateListing').mockImplementation();
    const addNewClientEnvSpy = jest.spyOn<any, any>(component, 'addNewClientEnv').mockImplementation();

    component['setSocketSubscription']();
    expect(onDeactivatedClientSpy).toHaveBeenCalled();
    expect(activateClientSpy).toHaveBeenCalled();

    expect(addNewClientEnvSpy).toHaveBeenCalledWith(HomeDropdownConstants.ACTIVATED_CLIENT);
    expect(updateListingSpy).toHaveBeenCalledWith(HomeDropdownConstants.DEACTIVATED_CLIENT);
  });

  it('should update listing', () => {
    component.clients = HomeDropdownConstants.DISTINCT_CLIENTS;
    component.environments = cloneDeep(HomeDropdownConstants.DISTINCT_ENVIRONMENTS);
    component.services = HomeDropdownConstants.DISTINCT_SERVICES;

    component['updateListing'](HomeDropdownConstants.DEACTIVATED_CLIENT);

    expect(component.clients).toEqual(HomeDropdownConstants.DISTINCT_FILTERED_CLIENTS);
    expect(component.environments).toEqual(HomeDropdownConstants.DISTINCT_FILTERED_ENVIRONMENTS);
    expect(component.services).toEqual(HomeDropdownConstants.DISTINCT_FILTERED_SERVICES);
  });

  it('should filter array based on array items and count', () => {
    const result = component['getDifference'](HomeDropdownConstants.DISTINCT_ENVIRONMENTS,[HomeDropdownConstants.DISTINCT_FILTERED_ENVIRONMENTS[0].name]);

    expect(result).toEqual([HomeDropdownConstants.DISTINCT_ENVIRONMENTS[0]]);
  });

  it('should add new env/service to the dropdowns', () => {
    component.environments = component.services = component['_teamService']['distinctEnvironments'] = component['_teamService']['distinctServices'] = [];
    const activatedClient = JSON.parse(HomeDropdownConstants.ACTIVATED_CLIENT);
    component['addNewValue'](activatedClient.environments, HomeDropdownConstants.ENVIRONMENTS.toLowerCase());

    expect(component.environments).toEqual(HomeDropdownConstants.DISTINCT_FILTERED_ENVIRONMENTS);
  });
});
