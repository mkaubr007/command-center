import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { MaterialModule } from '../../../../../material/material.module';
import { IDashboardSearchFilters } from '../../../../../shared/models/dashboard/dashboard-search-filters.interface';
import { ITeamOverview } from '../../../../../shared/models/team-member/team-member';
import { SharedService } from '../../../../../shared/shared.service';
import { SharedHomeModule } from '../../../../shared-home/shared-home.module';
import { DashboardService } from '../../../dashboard.service';
import { ErrorService } from '../errors-tab/error.service';
import { NewErrorsList } from '../errors-tab/shared/constants/errors-test.constants';

import { TeamOverviewComponent } from './team-overview.component';
import { TeamOverViewConstants } from './team-overview.constants';

class MockDashboardService {
  private serviceHealthFilters: BehaviorSubject<IDashboardSearchFilters> = new BehaviorSubject<IDashboardSearchFilters>(undefined);

  getDashboardFilters(): Observable<IDashboardSearchFilters> {
    return this.serviceHealthFilters.asObservable();
  }
}

class MockErrorService{

  public teamOverviewRefresh = new Subject();
  
  setDashboardFilterMatch() {}

  getTeamMemberOverview(): Observable<ITeamOverview[]> {
    return of(TeamOverViewConstants.TEAMOVERVIEW_LIST);
  }

  refreshTeamOverview(): Observable<any> {
    return of();
  }
}

class MockSharedService{
  openErrorSnackBar() {}
}

describe('TeamOverviewComponent', () => {
  let component: TeamOverviewComponent;
  let fixture: ComponentFixture<TeamOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamOverviewComponent ],
      imports: [
        CommonModule,
        MaterialModule,
        SharedHomeModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SharedService, useClass: MockSharedService }

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init component', () => {
    const setDashboardParamsSubscriptionSpy = jest.spyOn<any, any>(component, "setDashboardParamsSubscription").mockImplementation();

    component.ngOnInit();

    expect(setDashboardParamsSubscriptionSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from subscription on destroy', () => {
    const unsubscribe$Spy = spyOn(Subscription.prototype, 'unsubscribe');
    component['dashboardFilters$'] = component['teamOverviewRefresh$'] = new Subscription();

    component.ngOnDestroy();

    expect(unsubscribe$Spy).toHaveBeenCalledTimes(2);
  });

  it('should set dashboard params subscription', () => {
    const setDashboardFilterMatchSpy = jest.spyOn<any, any>(component['_errorService'], 'setDashboardFilterMatch').mockImplementation();
    const getTeamMemberOverviewSpy = jest.spyOn<any, any>(component, 'getTeamMemberOverview').mockImplementation();

    component['_dashboardService']['serviceHealthFilters'].next(NewErrorsList.DASHBOARD_PARAMS_INPUT);
    component['setDashboardParamsSubscription']();

    component['_dashboardService']['serviceHealthFilters'].subscribe((filters: IDashboardSearchFilters) => {
      expect(filters).toEqual(NewErrorsList.DASHBOARD_PARAMS_INPUT);
    });

    expect(component.isDataLoading).toBeTruthy();
    expect(setDashboardFilterMatchSpy).toHaveBeenCalledWith(NewErrorsList.DASHBOARD_PARAMS_INPUT);
    expect(getTeamMemberOverviewSpy).toHaveBeenCalled();
  });

  it('should set team overview refresh subscription', () => {
    const setTeamOverviewRefreshSubscriptionSpy = jest.spyOn<any, any>(component,'setTeamOverviewRefreshSubscription').mockImplementation();
    const getTeamMemberOverviewSpy = jest.spyOn<any, any>(component, 'getTeamMemberOverview').mockImplementation();

    component['_errorService']['teamOverviewRefresh'].next();

    component.ngOnInit();
    
    expect(component.isDataLoading).toBeTruthy();
    expect(setTeamOverviewRefreshSubscriptionSpy).toHaveBeenCalled();
    expect(getTeamMemberOverviewSpy).toHaveBeenCalled();
  });

  it('should set data from team overview API', () => {
    component.teamOverviewList = TeamOverViewConstants.TEAMOVERVIEW_LIST;

    component['setData']();

    expect(component.teamOverviewLength).toBe(3);
  });

  it('should get team member overview successfully', () => {
    const setDataSpy = jest.spyOn<any, any>(component, 'setData').mockImplementation();

    const getTeamMemberOverviewSpy = jest.spyOn<any, any>(component['_errorService'], 'getTeamMemberOverview').mockImplementation(
      () => { return of(TeamOverViewConstants.TEAMOVERVIEW_LIST); }
    );

    component['getTeamMemberOverview']();

    expect(getTeamMemberOverviewSpy).toHaveBeenCalled();

    expect(component.teamOverviewList).toEqual(TeamOverViewConstants.TEAMOVERVIEW_LIST);
    expect(component.isDataLoading).toBeFalsy();
    expect(setDataSpy).toHaveBeenCalled();
  });

  it('should get an error while fetching team member overview', () => {
    const openErrorSnackBarSpy = jest.spyOn<any, any>(component['_sharedService'], 'openErrorSnackBar').mockImplementation();
    jest.spyOn<any, any>(component['_errorService'], 'getTeamMemberOverview').mockImplementation(
      () => throwError(TeamOverViewConstants.GET_STATUS_FAILURE_RESPONSE) 
    );

    component['getTeamMemberOverview']();

    expect(component.isDataLoading).toBeFalsy();
    expect(openErrorSnackBarSpy).toHaveBeenCalledWith(TeamOverViewConstants.GET_STATUS_FAILURE_RESPONSE);
  });
});
