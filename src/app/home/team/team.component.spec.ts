import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamComponent } from './team.component';
import { TeamHeaderComponent } from './shared/components/team-header/team-header.component';
import { ManageClientsComponent } from './shared/components/manage-clients/manage-clients.component';
import { ManageTeamsComponent } from './shared/components/manage-teams/manage-teams.component';
import { ManageRolesComponent } from './shared/components/manage-roles/manage-roles.component';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedHomeModule } from '../shared-home/shared-home.module';
import { TeamService } from './team.service';
import { ParamMap } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamsUrlTab } from '../../shared/enums/teams-tab.enum';
import {
  WalkthroughSecond,
  WalkthroughFour,
  WalkthroughThird,
  WalkthroughFirst,
  WalkthroughFive,
} from '../../shared/enums/walkthrough.enum';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomHttpService } from 'src/app/core/services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { SetWalkthroughVisible } from '../../shared/models/walkthrough/walkthrough.model';
import { HomeService } from '../home.service';
import { TooltipModule } from 'ng2-tooltip-directive';

class MockAuthService {
 isFirstLogin=true;
} 
const ActivatedQueryParamMap: ParamMap = {
  get: (name: string): string => TeamsUrlTab.CLIENT,
  getAll: (name: string): string[] => [''],
  has: (name: string): boolean => true,
  keys: ['']
};

describe('TeamComponent', () => {
  let component: TeamComponent;
  let fixture: ComponentFixture<TeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeamComponent,
        ManageClientsComponent,
        ManageTeamsComponent,
        ManageRolesComponent,
        TeamHeaderComponent,
      ],
      imports: [
        CommonModule,
        HttpClientModule,
        MaterialModule,
        SharedHomeModule,
        TooltipModule,
        BlockUIModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        {provide:AuthService, useClass:MockAuthService},
        CustomHttpService,
        HomeService,
        { provide: APP_BASE_HREF, useValue: '/' },
        TeamService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set walkthrough Data to add a new client walkthrough', () => {
    component.walkthroughdata = null;
    let stepperData: SetWalkthroughVisible;
    stepperData = {
      stepper: 2,
      isMemberAdded: false,
    }
    component.getWalkthroughData(stepperData);

    expect(component.walkthroughdata).toEqual(WalkthroughSecond);
  });

  it('should set walkthrough Data to add a new environment', () => {
    component.walkthroughdata = null;

    let stepperData: SetWalkthroughVisible;
    stepperData = {
      stepper: 4,
      isMemberAdded: false,
    }
    component.getWalkthroughData(stepperData);

    expect(component.walkthroughdata).toEqual(WalkthroughFour);
  });

  it('shouldn\'t set the walkthrough Data ', () => {
    component.walkthroughdata = null;

    let stepperData: SetWalkthroughVisible;
    stepperData = {
      stepper: 1,
      isMemberAdded: false,
    }
    component.getWalkthroughData(stepperData);

    expect(component.walkthroughdata).toEqual(null);
  });

  it('should check for toggleWalkthrough function ', () => {
    component.isSkipped = true;

    component.toggleWalkthrough(true);

    expect(component.isSkipped).toEqual(false);

    component.toggleWalkthrough(false);

    expect(component.isSkipped).toEqual(true);
  });

  it('should create client walkthrough', () => {
    component.isWalkthroughVisible = false;
    component.walkthroughdata = null;

    component.createWalkthrough(TeamsUrlTab.CLIENT);

    expect(component.walkthroughdata).toEqual(WalkthroughThird);
  });

  it('should create teams walkthrough', () => {
    component.isWalkthroughVisible = false;
    component.walkthroughdata = null;

    component.createWalkthrough(TeamsUrlTab.TEAMS);

    expect(component.walkthroughdata).toEqual(WalkthroughFirst);
  });

  it('should create role walkthrough', () => {
    component.isWalkthroughVisible = true;

    component.createWalkthrough(TeamsUrlTab.ROLES);

    expect(component.isWalkthroughVisible).toBe(false);
  });

  it('set walkthrough Data for step 5 when member is not added before and is first time login', () => {
    component.walkthroughdata = null;

    let stepperData: SetWalkthroughVisible;
    stepperData = {
      stepper: 5,
      isMemberAdded: false,
    }
    component.getWalkthroughData(stepperData);

    expect(component.walkthroughdata).toEqual(WalkthroughFive);
  });
});
