import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAndUpdateTeamComponent } from './add-and-update-team.component';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../../../material/material.module';
import { TeamService } from '../../../team.service';
import { SharedService } from '../../../../../shared/shared.service';
import { CustomHttpService } from '../../../../../core/services/http.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedHomeModule } from '../../../../shared-home/shared-home.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ICreatedByRole,
  IAddTeamMember,
  IProfileParam,
} from '../../../../../shared/models/team-member/team-member';
import { of, Observable, throwError } from 'rxjs';
import Utils from '../../../../shared-home/utils/utils';
import { TeamMember, CreatedByRole } from '../../../../../shared/models/team-member/team-member.model';
import { LocalStorageConstants } from '../../../../../core/constants/local-storage.constants';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { AddTeamConstants } from './test.constant';

class TeamServiceMock extends TeamService {
  getMemberRoles(): Observable<ICreatedByRole[]> {
    return of(AddTeamConstants.MEMBER_ROLES.map(member => new CreatedByRole(member)));
  }

  uploadProfile(): Promise<IProfileParam> {
    return new Promise((resolve, reject) => {
      resolve(AddTeamConstants.UPLOAD_PROFILE_SUCCESS_RESPONSE);
      reject(AddTeamConstants.UPLOAD_PROFILE_ERROR_RESPONSE);
    });
  }

  addTeamMember(memberData: TeamMember): Observable<IAddTeamMember> {
    return of(AddTeamConstants.ADD_TEAM_MEMBER_SUCCESS_RESPONSE);
  }

  updateTeamMember(memberData: TeamMember, id: string): Observable<IAddTeamMember> {
    return of(AddTeamConstants.ADD_TEAM_MEMBER_SUCCESS_RESPONSE);
  }
}

describe('AddAndUpdateTeamComponent', () => {
  let component: AddAndUpdateTeamComponent;
  let fixture: ComponentFixture<AddAndUpdateTeamComponent>;
  let formBuilder: FormBuilder = new FormBuilder();
  let localStorage: LocalStorageService;

  const initAddTeamMemberForm = (data?: TeamMember) => {
    return {
      name: formBuilder.group({ first: null, last: null }),
      email: [null, [Validators.required, Utils.emptySpaceValidator(), Validators.email]],
      createdBy: formBuilder.group({ id: [], name: [] }),
      role: formBuilder.group({
        id: [null, [Validators.required, Utils.emptySpaceValidator()]],
        name: []
      })
    };
  };

  const dialogMock = { close: (value = '') => { } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MaterialModule,
        SharedHomeModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        HttpClientModule,
      ],
      declarations: [AddAndUpdateTeamComponent],
      providers: [
        LocalStorageService,
        SharedService,
        CustomHttpService,
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: TeamService, useClass: TeamServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAndUpdateTeamComponent);
    component = fixture.debugElement.componentInstance;
    localStorage = TestBed.get(LocalStorageService);
  });

  it('should set member roles', () => {
    component.memberRoles = null;

    component.setMemberRoles();

    expect(component.memberRoles).toEqual(AddTeamConstants.MEMBER_ROLES);
  });

  it('should open error popup while setting member roles', () => {
    component.memberRoles = null;

    jest
      .spyOn(component['_teamService'], 'getMemberRoles')
      .mockImplementation(() => throwError(AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE));

    const openSnackBarSpy = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation();

    component.setMemberRoles();

    expect(component.memberRoles).toEqual(null);
    expect(openSnackBarSpy).toHaveBeenCalledWith(AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE);
  });

  it('should close add team popup with data', async () => {
    const addTeamMember = jest
      .spyOn(component, 'addUpdateTeamMember')
      .mockImplementation();

    component.closePopup(true);

    expect(addTeamMember).toHaveBeenCalled();
  });

  it('add team member', () => {
    component.updateMemberData = null;
    component.data = AddTeamConstants.POPUP_DATA_RESPONSE;

    jest
      .spyOn(component['_teamService'], 'addTeamMember')
      .mockImplementation(() => of(AddTeamConstants.ADD_TEAM_MEMBER_SUCCESS_RESPONSE));

    formBuilder.group(initAddTeamMemberForm(AddTeamConstants.ADD_TEAM_MEMBER_DATA));

    jest.spyOn(component, 'getCreatedByOrRoleFormGroup');
    jest.spyOn(component, 'getNameFormGroup');
    jest.spyOn<any, string>(component, 'handleSuccess').mockImplementation();

    component.initAddNewTeamMemberForm();
    component.addUpdateTeamMember();

    expect(component['handleSuccess']).toHaveBeenCalledWith(AddTeamConstants.ADD_TEAM_MEMBER_SUCCESS_RESPONSE);
  });

  it('throw error while adding a team member', () => {
    component.updateMemberData = null;
    component.data = AddTeamConstants.POPUP_DATA_RESPONSE;

    jest
      .spyOn(component['_teamService'], 'addTeamMember')
      .mockImplementation(() => throwError(AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE));

    formBuilder.group(initAddTeamMemberForm(AddTeamConstants.ADD_TEAM_MEMBER_DATA));

    jest.spyOn(component, 'getCreatedByOrRoleFormGroup');
    jest.spyOn(component, 'getNameFormGroup');
    jest.spyOn<any, string>(component, 'handleError').mockImplementation();

    component.initAddNewTeamMemberForm();
    component.addUpdateTeamMember();

    expect(component['handleError']).toHaveBeenCalledWith(AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE);
  });

  it('update team member', () => {
    component.updateMemberData = new TeamMember();
    component.data = AddTeamConstants.POPUP_DATA_RESPONSE;

    jest
      .spyOn(component['_teamService'], 'updateTeamMember')
      .mockImplementation(() => of(AddTeamConstants.ADD_TEAM_MEMBER_SUCCESS_RESPONSE));

    formBuilder.group(initAddTeamMemberForm(AddTeamConstants.ADD_TEAM_MEMBER_DATA));

    jest.spyOn(component, 'getCreatedByOrRoleFormGroup');
    jest.spyOn(component, 'getNameFormGroup');
    jest.spyOn<any, string>(component, 'handleSuccess').mockImplementation();

    component.initAddNewTeamMemberForm();
    component.addUpdateTeamMember();

    expect(component['handleSuccess']).toHaveBeenCalledWith(AddTeamConstants.ADD_TEAM_MEMBER_SUCCESS_RESPONSE);
  });

  it('throw error while updating a team member', () => {
    component.updateMemberData = new TeamMember();
    component.data = AddTeamConstants.POPUP_DATA_RESPONSE;

    jest
      .spyOn(component['_teamService'], 'updateTeamMember')
      .mockImplementation(() => throwError(AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE));

    formBuilder.group(initAddTeamMemberForm(AddTeamConstants.ADD_TEAM_MEMBER_DATA));

    jest.spyOn(component, 'getCreatedByOrRoleFormGroup');
    jest.spyOn(component, 'getNameFormGroup');
    jest.spyOn<any, string>(component, 'handleError').mockImplementation(() => AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE);

    component.initAddNewTeamMemberForm();
    component.addUpdateTeamMember();

    expect(component['handleError']).toHaveBeenCalledWith(AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE);
  });

  it('should initialize add team member form', () => {
    component.data = AddTeamConstants.POPUP_DATA_RESPONSE;
    const formGroup = formBuilder.group(initAddTeamMemberForm(AddTeamConstants.ADD_TEAM_MEMBER_DATA));

    jest.spyOn(component, 'getCreatedByOrRoleFormGroup');
    jest.spyOn(component, 'getNameFormGroup');

    component.initAddNewTeamMemberForm();

    expect(component.addNewTeamMemberForm.value).toEqual(formGroup.value);
    expect(component.getCreatedByOrRoleFormGroup).toHaveBeenCalledTimes(2);
    expect(component.getNameFormGroup).toHaveBeenCalled();
  });

  it('should check for invalid form when empty', () => {
    component.data = AddTeamConstants.POPUP_DATA_RESPONSE;

    component.initAddNewTeamMemberForm();

    expect(component.addNewTeamMemberForm.valid).toBeFalsy();
  });

  it('should check email field validity', () => {
    component.data = AddTeamConstants.POPUP_DATA_RESPONSE;

    component.initAddNewTeamMemberForm();

    const email = component.addNewTeamMemberForm.controls['email'];

    expect(email.valid).toBeFalsy();
  });

  it('should create or add a new team member data', () => {
    component.data = AddTeamConstants.POPUP_DATA_RESPONSE;
    const name = 'test';

    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, '1');
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.FIRST_NAME, name);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.LAST_NAME, name);

    component.initAddNewTeamMemberForm();


    component.createAddNewTeamMemberData();

    const formValue = component.addNewTeamMemberForm.value;

    expect(formValue.createdBy.id).toBe('1');

    expect(formValue.createdBy.name).toBe(' test test');
  });

  it('should close popup', () => {
    const spy = jest.spyOn(component.dialogRef, 'close');
    component.closePopup();
    expect(spy).toHaveBeenCalled();
  });

  it('should check success popup', () => {
    const blockUIStopped = jest
      .spyOn(component['_sharedService'].blockUI, 'stop')
      .mockImplementation();

    const openSuccessSnackBar = jest
      .spyOn(component['_sharedService'], 'openSuccessSnackBar')
      .mockImplementation(() => of(AddTeamConstants.ADD_TEAM_MEMBER_SUCCESS_RESPONSE));

    component['handleSuccess'](AddTeamConstants.ADD_TEAM_MEMBER_SUCCESS_RESPONSE);

    expect(blockUIStopped).toHaveBeenCalledWith();
    expect(openSuccessSnackBar).toHaveBeenCalledWith(AddTeamConstants.ADD_TEAM_MEMBER_SUCCESS_RESPONSE);
  });

  it('should check error popup', () => {
    const blockUIStopped = jest
      .spyOn(component['_sharedService'].blockUI, 'stop')
      .mockImplementation();

    const openSuccessSnackBar = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation(() => of(AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE));

    component['handleError'](AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE);

    expect(blockUIStopped).toHaveBeenCalledWith();
    expect(openSuccessSnackBar).toHaveBeenCalledWith(AddTeamConstants.ADD_TEAM_MEMBER_ERROR_RESPONSE);
  });

  it('should return name Form Group', () => {
    const nameFormGroup = formBuilder.group({
      first: [null, [Validators.required, Utils.emptySpaceValidator()]],
      last: [null],
    });

    expect(component.getNameFormGroup().value).toEqual(nameFormGroup.value);
  });

  it('should return createdBy Form Group', () => {
    const createByFormGroup = formBuilder.group({ id: [], name: [] });

    expect(component.getCreatedByOrRoleFormGroup().value).toEqual(createByFormGroup.value);
  });

  it('should return role Form Group', () => {
    const createByFormGroup = formBuilder.group({ id: [], name: [] });

    expect(component.getCreatedByOrRoleFormGroup().value).toEqual(createByFormGroup.value);
  });

  it('should select role', () => {
    component.data = AddTeamConstants.POPUP_DATA_RESPONSE;
    component.memberRoles = AddTeamConstants.MEMBER_ROLES;
    component.initAddNewTeamMemberForm();
    component.onRoleSelection(AddTeamConstants.MEMBER_ROLES[0].id);
    expect(component.addNewTeamMemberForm.value.role.id).toEqual(AddTeamConstants.MEMBER_ROLES[0].id);
  });

});
