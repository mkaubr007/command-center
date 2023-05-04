import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { ServiceComponent } from './service.component';
import { DashboardService } from '../../../dashboard.service';
import { CustomHttpService } from '../../../../../core/services/http.service';
import { IClientServiceErrorMap } from '../../../../../shared/models/client/client-service-error-map.interface';
import { ClientServiceErrorMap } from 'src/app/shared/models/client/client-service-error-map.model';
import { SharedService } from '../../../../../shared/shared.service';
import { MaterialModule } from '../../../../../material/material.module';
import { HomeDropdownConstants } from '../../../../shared-home/components/home-dropdown/home-dropdown.constants';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
describe('ServiceComponent', () => {
  let component: ServiceComponent;
  let fixture: ComponentFixture<ServiceComponent>;

  class MockCustomHttpService {
    get() {
      return;
    }
  }
  class MockDashboardService extends DashboardService {
    getPrioritisedEnvironmentServices(): Observable<IClientServiceErrorMap[]> {
      return of([new ClientServiceErrorMap()]);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceComponent],
      imports: [MaterialModule],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: CustomHttpService, useClass: MockCustomHttpService },
        SharedService,
        LocalStorageService
      ],
    })
      .overrideTemplate(ServiceComponent, '<div></div>')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dateLabel gets formatted date', () => {
    const result = component.dateLabel('2020-08-21T17:44:48+05:30');
    expect(result).toBe('05:44 pm IST 08/21/2020');
  });

  it('should handle Error', () => {
    const errorResponse = {
      error: 'some error',
      message: 'Failure',
      statusCode: 400,
    };

    const openErrorSnackBar = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation(() => of(errorResponse));

    component.handleError(errorResponse);

    expect(openErrorSnackBar).toHaveBeenCalledWith(errorResponse);
    expect(component.isDataLoading).toBeTruthy();
  });

  it('should set Filter Subsciption', ()=> {
    component['_dashboardService']['serviceHealthFilters'].next(HomeDropdownConstants.DASHBOARD_FILTERS);
    const getDashboardDataSpy = jest.spyOn(component,'getDashboardData').mockImplementation();

    component.setFilterSubsciption();

    component['_dashboardService']['serviceHealthFilters'].subscribe(filters => {
      expect(filters).toEqual(HomeDropdownConstants.DASHBOARD_FILTERS);
      expect(getDashboardDataSpy).toHaveBeenCalledWith(HomeDropdownConstants.DASHBOARD_FILTERS);
    });
  });
});
