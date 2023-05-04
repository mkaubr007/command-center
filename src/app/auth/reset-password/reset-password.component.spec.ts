import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder, ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subscription, throwError } from 'rxjs';
import { CustomHttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ConfirmPopupComponent } from 'src/app/home/shared-home/components/confirm-popup/confirm-popup.component';
import { SharedHomeModule } from 'src/app/home/shared-home/shared-home.module';
import Utils from 'src/app/home/shared-home/utils/utils';
import { ConfirmedValidator } from 'src/app/shared/custom-validators/confirmed.validator';
import { MessageConstant } from '../../core/constants/message.constant';
import { TeamService } from '../../home/team/team.service';
import { PasswordValidatorService } from '../../services/password-validator/password-validator.service';
import { AuthService } from '../auth.service';
import { LoginComponent } from '../login/login.component';
import { AuthConstants } from '../test.constants';
import { ResetPasswordComponent } from './reset-password.component';

class MockAuthService {
  onLogin(): any {
    return of(true);
  }

  resetPassword(): any {
    return of(true);
  }

  loginUser(): Subscription {
    return new Subscription();
  }
}

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ data: 'returned data' }),
    };
  }
}

const confimMessageData = {
  width: '440px',
  disableClose: true,
  data: {
    title: MessageConstant.FORGET_PWD_CONFIRM_POPUP_TITLE,
    subTitle: MessageConstant.RESET_PWD_CONFIRM_POPUP_SUBTITLE,
    btnTxt: MessageConstant.RESET_PWD_CONFIRM_POPUP_BUTTON_TEXT,
  },
};

const initResetGroupDate = () => {
  const formBuilder: FormBuilder = new FormBuilder();
  const formFroup = formBuilder.group(
    {
      password: ['', [Validators.required, Utils.emptySpaceValidator()]],
      confirm_password: [
        '',
        [Validators.required, Utils.emptySpaceValidator()],
      ],
    },
    {
      validator: ConfirmedValidator('password', 'confirm_password'),
    }
  );

  return formFroup;
};

describe('Reset-password', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authService: AuthService;
  let teamService: TeamService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'auth/login', component: LoginComponent },
        ]),
        MatDialogModule,
        SharedHomeModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        HttpClientModule,
      ],
      providers: [
        LocalStorageService,
        { provide: MatDialog, useClass: MatDialogMock },
        CustomHttpService,
        PasswordValidatorService,
        { provide: AuthService, useClass: MockAuthService },
        TeamService,{
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({token: "test",auth:"1",status:'active'}),
          },
        }
      ],
      declarations: [ResetPasswordComponent, LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.debugElement.componentInstance;
    authService = TestBed.inject(AuthService);
    teamService = TestBed.inject(TeamService);
    
  }));

  it('should init confirm form', () => {

    component.initResetPasswordForm();

    expect(component.resetPasswordForm.value).toEqual(
      initResetGroupDate().value
    );
  });

  it('should open confirmation popup on set forgetPassword', () => {
    jest
      .spyOn(authService, 'resetPassword')
      .mockImplementation(() => of(AuthConstants.FORGOT_PASSWORD_RESET_DATA));
    const startLoadSpy = jest
      .spyOn(component, 'startLoading')
      .mockImplementation();
    const openConfirmationPopupSpy = jest.spyOn(
      component,
      'openConfirmationPopup'
    );
    const stopLoadingSpy = jest
      .spyOn(component, 'stopLoading')
      .mockImplementation();

    const validatePasswordSpy = jest.spyOn<any, any>(component['_passwordValidatorService'], 'validatePassword').mockImplementation(() => true);


    component.initResetPasswordForm();

    const pwd = component.resetPasswordForm.controls['password']
    pwd.setErrors(null);
    const confirmPwd = component.resetPasswordForm.controls['confirm_password']
    confirmPwd.setErrors(null);


    component.onClick(true);

    expect(validatePasswordSpy).toHaveBeenCalled();
    expect(startLoadSpy).toHaveBeenCalled();
    expect(openConfirmationPopupSpy).toHaveBeenCalled();
    expect(stopLoadingSpy).toHaveBeenCalled();
  });

  it('should open error popup on when forgetPassword throw error', () => {
    jest
      .spyOn(authService, 'resetPassword')
      .mockImplementation(() => throwError({ message: 'user does not exist' }));
    const startLoadSpy = jest
      .spyOn(component, 'startLoading')
      .mockImplementation();
    const stopLoadingSpy = jest
      .spyOn(component, 'stopLoading')
      .mockImplementation();

    jest.spyOn<any, any>(component['_passwordValidatorService'], 'validatePassword').mockImplementation(() => true);

    component.initResetPasswordForm();

    const pwd = component.resetPasswordForm.controls['password']
    pwd.setErrors(null);
    const confirmPwd = component.resetPasswordForm.controls['confirm_password']
    confirmPwd.setErrors(null);

    component.onClick(true);

    expect(startLoadSpy).toHaveBeenCalled();
    expect(stopLoadingSpy).toHaveBeenCalled();
  });

  it('should open confirmation Popup', () => {
    
    jest.spyOn(TestBed.inject(MatDialog), 'open');
    component.initResetPasswordForm();
    component.openConfirmationPopup('test');

    expect(component._dialog.open).toHaveBeenCalledWith(
      ConfirmPopupComponent,
      confimMessageData
    );

  });

  it('should start loading', () => {
    component.isLoaderActive = false;
    component.startLoading();

    expect(component.isLoaderActive).toBeTruthy();
  });

  it('should stop loading', () => {
    component.isLoaderActive = true;
    component.stopLoading();

    expect(component.isLoaderActive).toBeFalsy();
  });
});
