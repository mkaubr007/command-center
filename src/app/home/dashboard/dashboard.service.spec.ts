import { Observable, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { CustomHttpService } from '../../core/services/http.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { DashboardService } from './dashboard.service';
import {RoleConstants } from '../../core/constants/role.constant';
import { HttpResponse } from '@angular/common/http';
import { IMappedResponseData } from '../../shared/models/response/mapped-response.interface';
import { IClientServiceErrorMap } from '../../shared/models/client/client-service-error-map.interface';
import { LocalStorageConstants } from '../../core/constants/local-storage.constants';
import { HomeDropdownConstants } from '../shared-home/components/home-dropdown/home-dropdown.constants';

class CustomHttpServiceMock {
  get(): Observable<any> {
      return of(new HttpResponse<IMappedResponseData<IClientServiceErrorMap[]>>({'body':{'data':[]}}));
  }
}

describe('DashboardService', () => {
  let service: DashboardService;
  let localStorage: LocalStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            
            providers: [
              DashboardService,
              { provide: CustomHttpService , useClass: CustomHttpServiceMock },LocalStorageService
            ]
        }).compileComponents();
        service = TestBed.inject(DashboardService);
        localStorage = TestBed.inject(LocalStorageService);
        localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.ROLE, RoleConstants.CLIENT_SERVICE_REPRESENTATIVE);
        localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, HomeDropdownConstants.CSRID);
      });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    spyOn(localStorage,'getItemInLocalStorageWithoutJSON').and.returnValues(RoleConstants.CLIENT_SERVICE_REPRESENTATIVE);
    service.getPrioritisedEnvironmentServices().subscribe(response=>{
      expect(response.length).toBe(0);
    });
  });
});
