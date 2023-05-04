import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BlockUIModule } from 'ng-block-ui';
import { Observable, of, throwError } from 'rxjs';
import { MessageConstant } from 'src/app/core/constants/message.constant';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ErrorService } from 'src/app/home/dashboard/shared/components/errors-tab/error.service';
import { MockErrorService } from 'src/app/home/dashboard/shared/components/errors-tab/mock-error.service';
import { SocketService } from 'src/app/home/shared-home/services/socket/socket.service';
import { SharedHomeModule } from 'src/app/home/shared-home/shared-home.module';
import { CustomHttpService } from '../../../../../core/services/http.service';
import { MaterialModule } from '../../../../../material/material.module';
import { OrderBy, SortBy } from '../../../../../shared/enums/sorting.enum';
import { TeamMemberResponse } from '../../../../../shared/models/team-member/team-member.model';
import { SharedService } from '../../../../../shared/shared.service';
import { MockSocketService } from '../../../../shared-home/services/socket/socket-service.mock';
import { TeamService } from '../../../team.service';
import { AddAndUpdateTeamComponent } from '../add-and-update-team/add-and-update-team.component';
import { AddTeamConstants } from '../add-and-update-team/test.constant';
import { TeamHeaderComponent } from '../team-header/team-header.component';
import { ManageTeamsComponent } from './manage-teams.component';
import { ManageTeam } from './test.constants';

describe('ManageTeamsComponent', () => {
  let component: ManageTeamsComponent;
  let fixture: ComponentFixture<ManageTeamsComponent>;
  let dialog: MatDialog;
 
  class MatDialogMock {
    open() {
      return {
        afterClosed: () => of({ data: 'returned data' }),
      };
    }
  }
  class TeamServiceMock extends TeamService {
    searchByTeamMemberUserNameOrEmail(): Observable<TeamMemberResponse> {
      return of(ManageTeam.teamMemberDataResponse);
    }
    updateTeamMember():any { return of(true)}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ManageTeamsComponent,
        TeamHeaderComponent,
        AddAndUpdateTeamComponent,
      ],
      imports: [
        SharedHomeModule,
        MaterialModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        BlockUIModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: TeamService, useClass: TeamServiceMock },
        { provide: MatDialog, useClass: MatDialogMock },
        SharedService,
        CustomHttpService,
        LocalStorageService,
        {provide:ErrorService, useClass:MockErrorService},
        {provide:SocketService, useClass:MockSocketService}
      ],
    })
      .overrideComponent(ManageTeamsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTeamsComponent);
    component = fixture.debugElement.componentInstance;
    dialog = TestBed.get(MatDialog);
  });

  it('should initialize search params', () => {
    const spy = jest
      .spyOn(component, 'initSearchParams')
      .mockImplementation(() => of(ManageTeam.SEARCH_PARAM_DATA));

    component.initSearchParams();

    expect(spy).toHaveBeenCalled();
  });

  it('should create team member list', () => {
    const initSearchParamsSpy = jest
      .spyOn(component, 'initSearchParams')
      .mockImplementation(() => of(ManageTeam.SEARCH_PARAM_DATA));
    const spy = jest
      .spyOn(component['_teamService'], 'searchByTeamMemberUserNameOrEmail')
      .mockImplementation(() => of(ManageTeam.teamMemberDataResponse));
    const setTeamMemberDataSpy = jest
      .spyOn(component, 'setTeamMemberData')
      .mockImplementation();
    component.searchParams = {};
    component.createTeamMemberList();

    expect(initSearchParamsSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(setTeamMemberDataSpy).toHaveBeenCalled();
  });

  it('should throw error for team member', () => {
    const spy = jest
      .spyOn(component['_teamService'], 'searchByTeamMemberUserNameOrEmail')
      .mockImplementation(() =>
        throwError(ManageTeam.MEMBER_DATA_ERROR_RESPONSE)
      );

    const handleErrorSpy = jest
      .spyOn<any, string>(component, 'handleError')
      .mockImplementation(() => ManageTeam.MEMBER_DATA_ERROR_RESPONSE);

    component.createTeamMemberList();

    expect(spy).toHaveBeenCalled();
    expect(handleErrorSpy).toHaveBeenCalledWith(
      ManageTeam.MEMBER_DATA_ERROR_RESPONSE
    );
  });

  it('should be able to sort column', () => {
    const getSortedDataSpy = jest
      .spyOn(component, 'getSortedData')
      .mockImplementation();

    component.sortColumn(ManageTeam.ErrorsTableHeader[0]);
    component.sortingOrder = {
      sortBy: SortBy.TEAM_MEMBER,
      orderBy: OrderBy.ASC,
    };
    expect(getSortedDataSpy).toHaveBeenCalledWith(
      SortBy.TEAM_MEMBER,
      OrderBy.ASC
    );

    component.sortColumn(ManageTeam.ErrorsTableHeader[1]);
    component.sortingOrder = {
      sortBy: SortBy.TEAM_MEMBER,
      orderBy: OrderBy.DESC,
    };
    expect(getSortedDataSpy).toHaveBeenCalledWith(
      SortBy.TEAM_MEMBER,
      OrderBy.DESC
    );

    component.sortColumn(ManageTeam.ErrorsTableHeader[2]);
    component.sortingOrder = {
      sortBy: SortBy.EMAIL,
      orderBy: OrderBy.ASC,
    };
    expect(getSortedDataSpy).toHaveBeenCalledWith(SortBy.EMAIL, OrderBy.ASC);

    component.sortColumn(ManageTeam.ErrorsTableHeader[3]);
    component.sortingOrder = {
      sortBy: SortBy.EMAIL,
      orderBy: OrderBy.DESC,
    };
    expect(getSortedDataSpy).toHaveBeenCalledWith(SortBy.EMAIL, OrderBy.DESC);

    component.sortColumn(ManageTeam.ErrorsTableHeader[4]);
    component.sortingOrder = {
      sortBy: SortBy.ROLE,
      orderBy: OrderBy.ASC,
    };
    expect(getSortedDataSpy).toHaveBeenCalledWith(SortBy.ROLE, OrderBy.ASC);

    component.sortColumn(ManageTeam.ErrorsTableHeader[5]);
    component.sortingOrder = {
      sortBy: SortBy.ROLE,
      orderBy: OrderBy.DESC,
    };
    expect(getSortedDataSpy).toHaveBeenCalledWith(SortBy.ROLE, OrderBy.DESC);
  });

  it('should get sorted data', () => {
    const searchByTeamMemberUserNameOrEmailSpy = jest
      .spyOn(component['_teamService'], 'searchByTeamMemberUserNameOrEmail')
      .mockImplementation(() => of(ManageTeam.teamMemberDataResponse));
    const blockUIStart = jest
      .spyOn(component['_sharedService'].blockUI, 'start')
      .mockImplementation();
    const setTeamMemberDataSpy = jest
      .spyOn(component, 'setTeamMemberData')
      .mockImplementation();
    const blockUIStop = jest
      .spyOn(component['_sharedService'], 'stopBlockUI')
      .mockImplementation();
    component.searchParams = {};
    component.getSortedData(SortBy.TEAM_MEMBER, OrderBy.ASC);

    expect(blockUIStart).toHaveBeenCalled();
    expect(searchByTeamMemberUserNameOrEmailSpy).toHaveBeenCalled();
    expect(setTeamMemberDataSpy).toHaveBeenCalled();
    expect(blockUIStop).toHaveBeenCalled();
  });

  it('should throw error for sorted data', () => {
    const spy = jest
      .spyOn(component['_teamService'], 'searchByTeamMemberUserNameOrEmail')
      .mockImplementation(() =>
        throwError(ManageTeam.MEMBER_DATA_ERROR_RESPONSE)
      );

    const handleErrorSpy = jest
      .spyOn<any, string>(component, 'handleError')
      .mockImplementation(() => ManageTeam.MEMBER_DATA_ERROR_RESPONSE);
    component.searchParams = {};
    component.getSortedData(SortBy.TEAM_MEMBER, OrderBy.ASC);

    expect(spy).toHaveBeenCalled();
    expect(handleErrorSpy).toHaveBeenCalledWith(
      ManageTeam.MEMBER_DATA_ERROR_RESPONSE
    );
  });

  it('should get paginated data', () => {
    const searchByTeamMemberUserNameOrEmailSpy = jest
      .spyOn(component['_teamService'], 'searchByTeamMemberUserNameOrEmail')
      .mockImplementation(() => of(ManageTeam.teamMemberDataResponse));
    const blockUIStart = jest
      .spyOn(component['_sharedService'].blockUI, 'start')
      .mockImplementation();
    const setTeamMemberDataSpy = jest
      .spyOn(component, 'setTeamMemberData')
      .mockImplementation();
    const blockUIStop = jest
      .spyOn(component['_sharedService'], 'stopBlockUI')
      .mockImplementation();
    component.searchParams = {};
    component.getPaginatedData(10, 1);

    expect(blockUIStart).toHaveBeenCalled();
    expect(searchByTeamMemberUserNameOrEmailSpy).toHaveBeenCalledWith({limit: 10, skip: 1, sort: {'name.first': 1}});
    expect(setTeamMemberDataSpy).toHaveBeenCalled();
    expect(blockUIStop).toHaveBeenCalled();
  });

  it('should throw error for paginated data', () => {
    const spy = jest
      .spyOn(component['_teamService'], 'searchByTeamMemberUserNameOrEmail')
      .mockImplementation(() =>
        throwError(ManageTeam.MEMBER_DATA_ERROR_RESPONSE)
      );

    const handleErrorSpy = jest
      .spyOn<any, string>(component, 'handleError')
      .mockImplementation(() => ManageTeam.MEMBER_DATA_ERROR_RESPONSE);
    component.searchParams = {};
    component.getPaginatedData(10, 1);

    expect(spy).toHaveBeenCalled();
    expect(handleErrorSpy).toHaveBeenCalledWith(
      ManageTeam.MEMBER_DATA_ERROR_RESPONSE
    );
  });

  it('should call page change', () => {
    const getPaginatedDataSpy = jest
      .spyOn(component, 'getPaginatedData')
      .mockImplementation();

    component.changePage(ManageTeam.PAGINATOR);

    expect(getPaginatedDataSpy).toHaveBeenCalledWith(
      10,
      ManageTeam.PAGINATOR.pageIndex + 1
    );
  });

  it('should open pop up', () => {
    const addTeamMemberPopupSpy = jest
      .spyOn(component, 'addTeamMemberPopup')
      .mockImplementation();

    component.openPopup(true);

    expect(addTeamMemberPopupSpy).toHaveBeenCalled();
  });

  it('should open edit member popup', () => {
    component.teamMembersData = ManageTeam.teamMemberData;
    const updateTeamMemberPopup = jest
      .spyOn(component, 'updateTeamMemberPopup')
      .mockImplementation();

    component.openEditMemberPopup(ManageTeam.individualMemberData[0]);

    expect(updateTeamMemberPopup).toHaveBeenCalledWith(
      ManageTeam.teamMemberData[0]
    );
  });

  it('should open update team member Popup', () => {
    jest.spyOn(TestBed.get(MatDialog), 'open');
    const createTeamMemberListSpy = jest
      .spyOn(component, 'createTeamMemberList')
      .mockImplementation(() =>
        throwError(ManageTeam.MEMBER_DATA_ERROR_RESPONSE)
      );

    component.updateTeamMemberPopup(ManageTeam.teamMemberData[0]);

    expect(component._dialog.open).toHaveBeenCalledWith(
      AddAndUpdateTeamComponent,
      ManageTeam.editMessageData
    );
    expect(createTeamMemberListSpy).toHaveBeenCalled();
  });


  it('On close the update team member Popup should not refresh create team members', () => {
    jest.spyOn(dialog, 'open').mockReturnValue({
        afterClosed: () => of(false),
        close: null,
      } as MatDialogRef<any, any>);

    const createTeamMemberListSpy = jest
      .spyOn(component, 'createTeamMemberList')
      .mockImplementation(() =>
      throwError(ManageTeam.MEMBER_DATA_ERROR_RESPONSE)
    );

    component.updateTeamMemberPopup(ManageTeam.teamMemberData[0]);

    expect(createTeamMemberListSpy).toHaveBeenCalledTimes(0);
  });

  it('should open deactivate team member popup', () => {
    jest.spyOn(TestBed.inject(MatDialog), 'open');
    const openErrorSnackBarSpy = jest
      .spyOn(component['_sharedService'], 'openSuccessSnackBar')
      .mockImplementation();
      const emitDeactivatedTeamMemberSpy = jest
      .spyOn(component['_socketService'], 'emitDeactivatedTeamMember')
      .mockImplementation();
    
    component.openDeactivateMemberPopup(ManageTeam.INDIVIDUAL_MEMBER.id, '123', MessageConstant.CLIENT_SERVICE_REPRESENTATIVE);

    expect(component._dialog.open).toHaveBeenCalled();
    expect(openErrorSnackBarSpy).toHaveBeenCalled();
    expect(emitDeactivatedTeamMemberSpy).toHaveBeenCalled();

  });

  it('should open add team member Popup', () => {
    jest.spyOn(TestBed.get(MatDialog), 'open');
    const createTeamMemberListSpy = jest.spyOn(
      component,
      'createTeamMemberList'
    );

    component.addTeamMemberPopup();

    expect(component._dialog.open).toHaveBeenCalledWith(
      AddAndUpdateTeamComponent,
      ManageTeam.messageData
    );
    expect(createTeamMemberListSpy).toHaveBeenCalled();
  });

  it('should handle Error', () => {
    const openErrorSnackBar = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation(() =>
        of(AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE)
      );

    component.handleError(AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE);

    expect(openErrorSnackBar).toHaveBeenCalledWith(
      AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE
    );
    expect(component.isDataLoading).toBeTruthy();
  });

  it('should set team member data', () => {
    const blockUIStop = jest
      .spyOn(component['_sharedService'], 'stopBlockUI')
      .mockImplementation();

    component.setTeamMemberData(
      ManageTeam.GET_TEAM_MEMEBER_RESPONSE.data.result,
      ManageTeam.GET_TEAM_MEMEBER_RESPONSE.data.count
    );

    expect(component.dataSource).toBeTruthy();
    expect(component.isDataLoading).toBeFalsy();
    expect(blockUIStop).toHaveBeenCalled();
  });

  it('should change page size', () => {
    const getPaginatedDataSpy = jest
      .spyOn(component, 'getPaginatedData')
      .mockImplementation();

    component.changePageSize(4);
    component.currentPage = 1;

    expect(getPaginatedDataSpy).toHaveBeenCalledWith(4, 1);
  });

  it('should change page', () => {
    const getPaginatedDataSpy = jest
      .spyOn(component, 'getPaginatedData')
      .mockImplementation();

    component.changePage({
      length: 7,
      pageIndex: 1,
      pageSize: 10,
      previousPageIndex: 0,
    });
    component.currentPage = 2;

    expect(getPaginatedDataSpy).toHaveBeenCalledWith(10, 2);
  });

  it('should clear search', () => {
    const createTeamMemberListSpy = jest
      .spyOn(component, 'createTeamMemberList')
      .mockImplementation(() =>
        throwError(ManageTeam.MEMBER_DATA_ERROR_RESPONSE)
      );

    component.noSearchResults = true;
    component.onClear();
    expect(createTeamMemberListSpy).toHaveBeenCalled();
  });
});
