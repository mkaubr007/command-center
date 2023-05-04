import { MatDialogRef } from '@angular/material/dialog';
import { EditProfileComponent } from './edit-profile.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { CustomHttpService } from '../../../../core/services/http.service';
import { SharedService } from '../../../../shared/shared.service';
import { MaterialModule } from '../../../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BlockUIModule } from 'ng-block-ui';
import { SharedHomeModule } from '../../shared-home.module';
import { TeamService } from '../../../team/team.service';
import { LocalStorageConstants } from '../../../../core/constants/local-storage.constants';
import { EditProfileConstants } from './edit-profile.test.constants';
import { Observable, of, throwError } from 'rxjs';
import { IAddTeamMember } from '../../../../shared/models/team-member/team-member';
import { EditImage } from '../edit-image/edit-image.constants';
class TeamServiceMock extends TeamService {
  updateTeamMember(): Observable<IAddTeamMember> {
    return of(EditProfileConstants.EDIT_PROFILE_RESPONSE);
  }
}

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let formBuilder: FormBuilder = new FormBuilder();
  let localStorage: LocalStorageService;

  const initEditProfileForm = () => {
    return {
      profile: [],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [{ value: null, disabled: true }, Validators.required],
    };
  };

  const dialogMock = { close: (value = '') => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        SharedHomeModule,
        BlockUIModule.forRoot(),
        HttpClientModule,
        RouterTestingModule,
      ],
      declarations: [],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: TeamService, useClass: TeamServiceMock },
        LocalStorageService,
        CustomHttpService,
        SharedService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.debugElement.componentInstance;
    localStorage = TestBed.get(LocalStorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init edit profile', () => {
    const id = 'test_id';
    const formGroup = formBuilder.group(initEditProfileForm());
    localStorage.setItemInLocalStorageWithoutJSON(
      LocalStorageConstants.USER_ID,
      id
    );

    component.ngOnInit();
    expect(component.editProfileForm.value).toEqual(formGroup.value);
    expect(component.userId).toEqual(EditProfileConstants.USER_ID);
  });

  it('should update user data when no profile image is upated', () => {
    const updateUserInfo = jest
      .spyOn(component, 'updateUserInfo')
      .mockImplementation();

    component.updateUserData();

    expect(updateUserInfo).toHaveBeenCalled();
  });

  it('should update user data when profile image is updated', () => {
    jest.spyOn(component, 'updateUserData');
    const uploadProfilePicture = jest
      .spyOn(component, 'uploadProfilePicture')
      .mockImplementation();

    const formData = new FormData();
    formData.append(
      'file',
      new Blob(),
      EditImage.EVENT_WITH_DATA['target'].files[0].name
    );

    component.profilePicture = formData;

    component.updateUserData();

    expect(uploadProfilePicture).toHaveBeenCalledWith(formData);
    expect(component.updateUserData).toHaveBeenCalled();
  });

  it('should update profile picture', () => {
    jest.spyOn(component, 'startLoading').mockImplementation();
    jest.spyOn(component, 'uploadProfilePicture').mockImplementation();
    jest.spyOn(component, 'updateUserInfo').mockImplementation();

    component.uploadProfilePicture(component.profilePicture);

    expect(component.uploadProfilePicture).toHaveBeenCalledWith(
      component.profilePicture
    );
  });

  it('should change profile name successfully', () => {
    jest.spyOn(component, 'updateUserInfo');
    jest.spyOn(component as any, 'storeUpdatedName').mockImplementation();
    const openSuccessSnackBar = jest
      .spyOn(component['_sharedService'], 'openSuccessSnackBar')
      .mockImplementation(() => of(EditProfileConstants.USER_DATA));

    jest.spyOn(component, 'closePopup');

    component.updateUserInfo();

    expect(component.closePopup).toHaveBeenCalledWith(
      EditProfileConstants.EDIT_PROFILE_RESPONSE.data.name
    );

    expect(openSuccessSnackBar).toHaveBeenCalledWith(
      EditProfileConstants.EDIT_PROFILE_RESPONSE
    );
    expect(component.updateUserInfo).toHaveBeenCalled();
  });

  it('should result in error while changing profile name', () => {
    component.editProfileForm.patchValue(
      EditProfileConstants.EDIT_PROFILE_DATA
    );
    jest.spyOn(component, 'closePopup');

    jest
      .spyOn(component['_teamService'], 'updateTeamMember')
      .mockImplementation(() =>
        throwError(EditProfileConstants.EDIT_PROFILE_ERROR_RESPONSE)
      );

    const openSnackBarSpy = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation();

    component.updateUserInfo();

    expect(component.closePopup).toHaveBeenCalledWith(false);

    expect(openSnackBarSpy).toHaveBeenCalledWith(
      EditProfileConstants.EDIT_PROFILE_ERROR_RESPONSE
    );
  });

  it('popup close', () => {
    let spy = jest.spyOn(component['dialogRef'], 'close');

    component.closePopup(false);

    expect(spy).toHaveBeenCalled();
  });

  it('should start loading', () => {
    component.startLoading();

    expect(component.isLoaderActive).toBeTruthy();
  });

  it('should stop loading', () => {
    component.stopLoading();

    expect(component.isLoaderActive).toBeFalsy();
  });
});
