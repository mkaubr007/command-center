import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomTabComponent } from './custom-tab.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../../material/material.module';
import { ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TeamsUrlTab } from '../../../../shared/enums/teams-tab.enum';
import { RouteConstants } from '../../../../core/constants/route.constants';
import { ErrorUrlTab } from '../../../../shared/enums/error-tab.enum';
import { ErrorService } from '../../../dashboard/shared/components/errors-tab/error.service';
import { MockErrorService } from '../../../dashboard/shared/components/errors-tab/mock-error.service';

describe('CustomTabComponent', () => {
  let component: CustomTabComponent;
  let fixture: ComponentFixture<CustomTabComponent>;

  const ActivatedQueryParamMap: ParamMap = {
    get: (name: string): string => TeamsUrlTab.CLIENT,
    getAll: (name: string): string[] => [''],
    has: (name: string): boolean => true,
    keys: [''],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialModule],
      providers: [
        { provide: ErrorService, useClass: MockErrorService }
      ],
      declarations: [CustomTabComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTabComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selected Tab from query param', () => {
    component.updateUrl = false;

    jest.spyOn(component, 'setSelectedTab');
    jest
      .spyOn(component['_route'], 'queryParamMap', 'get')
      .mockImplementation(() => of(ActivatedQueryParamMap));

    component.setSelectedTab();

    expect(component.setSelectedTab).toHaveBeenCalled();
    expect(component.selectedTab).toEqual(0);
  });

  it('should change route on tab click when placement is header', () => {
    component.updateUrl = false;
    component.placement = 'header';

    jest.spyOn(component, 'onTabChange');

    jest
      .spyOn(component['_router'], 'navigate')
      .mockImplementation(() => Promise.resolve(true));

    component.onTabChange(1);

    expect(component['_router'].navigate).toHaveBeenCalledWith(
      [RouteConstants.TEAM_MANAGE],
      {
        queryParams: {
          _tab: TeamsUrlTab.TEAMS,
        },
      }
    );
    expect(component.onTabChange).toHaveBeenCalledWith(1);
  });

  it('should change route on tab click when placement is body', () => {
    component.updateUrl = false;
    component.placement = 'body';

    jest.spyOn(component, 'onTabChange');

    jest
      .spyOn(component['_router'], 'navigate')
      .mockImplementation(() => Promise.resolve(true));

    component.onTabChange(1);

    expect(component['_router'].navigate).toHaveBeenCalledWith(
      [RouteConstants.DASHBOARD],
      {
        queryParams: {
          _tab: ErrorUrlTab.NEW,
        },
      }
    );
    expect(component.onTabChange).toHaveBeenCalledWith(1);
  });

  it('should emit value if updateUrl === false', () => {
    component.updateUrl = false;

    jest.spyOn(component, 'onTabChange');
    jest.spyOn(component.selectedPopupTab, 'emit').mockImplementation();

    component.onTabChange(1);

    expect(component.onTabChange).toHaveBeenCalledWith(1);
    expect(component.selectedPopupTab.emit).toHaveBeenCalledWith(1);
  });
});
