import { JiraService } from './../../../../../shared/services/jira.service';
import { CoreModule } from './../../../../../core/core.module';
import { StatusService } from './../../../../../shared/services/status.service';
import { ErrorUrlTab } from './../../../../../shared/enums/error-tab.enum';
import { ErrorsTableComponent } from './../../errors-table/errors-table.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../../../../auth/auth.service';
import { LocalStorageConstants } from '../../../../../core/constants/local-storage.constants';
import { RoleConstants } from '../../../../../core/constants/role.constant';
import { CustomHttpService } from '../../../../../core/services/http.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { MaterialModule } from '../../../../../material/material.module';
import { IErrorDetailCount } from '../../../../../shared/models/error-detail/error-detail.interface';
import { CacheService } from '../../../../cache-service';
import { SharedHomeModule } from '../../../../shared-home/shared-home.module';
import { TeamService } from '../../../../team/team.service';
import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorService } from './error.service';
import { ErrorsTabComponent } from './errors-tab.component';
import { ErrorConstants } from './shared/constants/error.constants';
import { NewErrorsList } from './shared/constants/errors-test.constants';
import { ErrorFilterComponent } from '../error-filter/error-filter.component';
import { ErrorFilterListComponent } from '../error-filter-list/error-filter-list.component';
import { IDashboardSearchFilters } from '../../../../../shared/models/dashboard/dashboard-search-filters.interface';
import { ErrorFilterDisplayComponent } from '../error-filter-display/error-filter-display.component';
import { CsvExportComponent } from '../../../../../shared/modules/csv-export/csv-export.component';
import { CsvExportService } from '../../../../../shared/modules/csv-export/csv-export.service';
import { WebSocketService } from '../../../../../services/web-socket/web-socket.service';

const moment = require('moment').default || require('moment');

class MockAuthService extends AuthService {
  loginUserWithJira = () => of({ message: 'Success', userId: '1' });
}

class MockErrorService extends ErrorService {
  onSearchByErrorChange = () => { };

  getErrorCount(): Observable<IErrorDetailCount> {
    return of(ErrorConstants.ERROR_COUNT_RESULT);
  }
}

class MockWebSocketService {}

describe('ErrorsTabComponent', () => {
  let component: ErrorsTabComponent;
  let fixture: ComponentFixture<ErrorsTabComponent>;
  let localStorage: LocalStorageService;

  const ActivatedQueryParamMap: ParamMap = {
    get: (name: string): string => ErrorUrlTab.ALL,
    getAll: (name: string): string[] => [''],
    has: (name: string): boolean => true,
    keys: [''],
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        ErrorsTabComponent,
        DashboardHeaderComponent,
        ErrorsTableComponent,
        ErrorFilterComponent,
        ErrorFilterListComponent,
        ErrorFilterDisplayComponent,
        CsvExportComponent
      ],
      imports: [
        CoreModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule,
        HttpClientModule,
        SharedHomeModule,
        BrowserAnimationsModule
      ],
      providers: [
        LocalStorageService,
        TeamService,
        CacheService,
        CsvExportService,
        StatusService,
        CustomHttpService,
        JiraService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: WebSocketService, useClass: MockWebSocketService }
      ]
    }).compileComponents();

    localStorage = TestBed.inject(LocalStorageService);
    localStorage
      .setItemInLocalStorageWithoutJSON(LocalStorageConstants.ROLE, RoleConstants.CLIENT_SERVICE_REPRESENTATIVE);
    localStorage
      .setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, '2334');

    fixture = TestBed.createComponent(ErrorsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check url', () => {

    jest
      .spyOn(component['route'], 'queryParamMap', 'get')
      .mockImplementation(() => of(ActivatedQueryParamMap));

    component.checkUrl();

    expect(component.selectedTab)
      .toEqual(ErrorUrlTab.ALL);
  });

  it('should get error count', () => {
    component.errorService.isRoleCSR = true;
    component.errorService.currentUserId = NewErrorsList.LOCAL_STORAGE_CONSTANTS.user_id;
    localStorage
      .setItemInLocalStorageWithoutJSON(LocalStorageConstants.ROLE, RoleConstants.CLIENT_SERVICE_REPRESENTATIVE);

    const getErrorCountSpy = jest
      .spyOn(component.errorService, 'getErrorCount')
      .mockImplementation();

    component.getErrorCount();

    expect(getErrorCountSpy).toHaveBeenCalled();

  });

  it('should set badge count', () => {
    component["setBadgeCount"](ErrorConstants.ERROR_COUNT_RESULT);

    expect(component.tabsName)
      .toEqual(ErrorConstants.TAB_UPDATED_BADGE_COUNT);
  });

  it('should update badge count', () => {
    component.tabsName = ErrorConstants.TAB_UPDATED_BADGE_COUNT;

    const newErrorTab = component.tabsName[1];
    const unresolvedManualErrorTab = component.tabsName[2];

    newErrorTab.badge = -1;
    unresolvedManualErrorTab.badge = +1;

    component.updateBadgeCount(ErrorConstants.TAB_ADJUSTMENT);


    expect(component.tabsName[1])
      .toEqual(newErrorTab);

    expect(component.tabsName[2])
      .toEqual(unresolvedManualErrorTab);
  });

  it('should check onTabChange', () => {
    const onSearchByErrorChangeMock = jest
      .spyOn(component.errorService, 'onSearchByErrorChange')
      .mockImplementation();

    const updateFilterListeMock = jest
      .spyOn(component.errorService, 'updateFilterList')
      .mockImplementation();

    component.onTabChange(0);

    expect(onSearchByErrorChangeMock)
      .toHaveBeenCalledWith('', false);
    expect(updateFilterListeMock).toHaveBeenCalledWith(component.tabsName[0].key);
  });

  it('should set dashboard params subscription', () =>{
    const getErrorCountSpy = jest.spyOn(component, 'getErrorCount').mockImplementation();
    component['_dashboardService']['serviceHealthFilters'].next(NewErrorsList.DASHBOARD_PARAMS_INPUT);
    component['setDashboardParamsSubscription']();

    component['_dashboardService']['serviceHealthFilters'].subscribe((filters: IDashboardSearchFilters) => {
      expect(filters).toEqual(NewErrorsList.DASHBOARD_PARAMS_INPUT);
      expect(getErrorCountSpy).toHaveBeenCalled();
    });
  });
});
