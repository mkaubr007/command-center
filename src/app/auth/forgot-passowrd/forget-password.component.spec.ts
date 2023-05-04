import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BlockUIModule } from 'ng-block-ui';
import { of, throwError } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ConfirmPopupComponent } from 'src/app/home/shared-home/components/confirm-popup/confirm-popup.component';
import { SharedHomeModule } from 'src/app/home/shared-home/shared-home.module';
import Utils from 'src/app/home/shared-home/utils/utils';
import { LocalStorageConstants } from '../../core/constants/local-storage.constants';
import { RouteConstants } from '../../core/constants/route.constants';
import { CustomHttpService } from '../../core/services/http.service';
import { AuthService } from '../auth.service';
import { LoginComponent } from '../login/login.component';
import { AuthConstants } from '../test.constants';
import { ForgotPassowrdComponent } from './forgot-passowrd.component';


class MockAuthService {
  forgotPassword(): any {
    return of({ message: 'Success', userId: '1' });
  }
}

class MockCustomHttpService {}

const confimMessageData = {
  width: '440px',
  disableClose: true,
  data: {
    title: 'Please check your email',
    subTitle:
      'A password reset link has been sent to your inbox. Please follow the instructions on the email to reset your password.',
    btnTxt: 'Ok',
  },
};

const initResetGroupDate = () => {
  return {
    email: [
      '',
      [Validators.required, Utils.emptySpaceValidator(), Validators.email],
    ],
    redirectURL: [`${window.location.origin}/${RouteConstants.RESET_PASSWORD}`],
  };
};

describe('Forget-password', () => {
  let component: ForgotPassowrdComponent;
  let fixture: ComponentFixture<ForgotPassowrdComponent>;
  let dialog: MatDialog;

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
        BlockUIModule.forRoot()
      ],
      providers: [
        LocalStorageService,
        MatDialog,
        { provide: CustomHttpService, useClass: MockCustomHttpService },
        { provide: AuthService, useClass: MockAuthService },
      ],
      declarations: [LoginComponent, ForgotPassowrdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassowrdComponent);
    component = fixture.debugElement.componentInstance;
    dialog = TestBed.get(MatDialog);
  }));

  it('should init component', () => {
    expect(component).toBeTruthy();
  });

  it('should init confirm form', () => {
    const formBuilder: FormBuilder = new FormBuilder();
    const formFroup = formBuilder.group(initResetGroupDate());

    component.initConfirmEmailForm();

    expect(component.confirmEmailForm.value).toEqual(formFroup.value);
  });

  it('should open confirmation Popup', () => {
    const spy = jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of({}),
      close: null,
    } as MatDialogRef<any, any>);
    const navigateSpy = jest.spyOn(component['_router'], 'navigate');

    component.openConfirmationPopup();

    expect(spy).toHaveBeenCalledWith(ConfirmPopupComponent, confimMessageData);

    expect(navigateSpy).toHaveBeenCalledWith([RouteConstants.LOGIN]);
  });

  it('should get confirmEmailFormControl', () => {
    component.initConfirmEmailForm();

    jest
      .spyOn(component, 'confirmEmailFormControl', 'get')
      .mockReturnValue(component.confirmEmailForm.controls);

    expect(component.confirmEmailFormControl).toEqual(
      component.confirmEmailForm.controls
    );
  });

  it('should open confirmation popup on set forgotPassword', () => {
    const openConfirmPopupSpy = jest
      .spyOn(component, 'openConfirmationPopup')
      .mockImplementation();

    const localstorageSpy = jest
      .spyOn(component['_localStorage'], 'setItemInLocalStorage')
      .mockImplementation();

    component.initConfirmEmailForm();

    component.requestForgotPassword();

    expect(openConfirmPopupSpy).toHaveBeenCalled();
    expect(localstorageSpy).toHaveBeenCalledWith(
      LocalStorageConstants.USER_ID,
      '1'
    );
  });

  it('should open error popup on failure of forgotPassword', () => {
    jest
      .spyOn(component['_authService'], 'forgotPassword')
      .mockImplementation(() =>
        of(AuthConstants.FORGOT_PASSWORD_ERROR_RESPONSE)
      );

    const openSnackBarSpy = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation();

    component.initConfirmEmailForm();

    component.requestForgotPassword();

    expect(openSnackBarSpy).toHaveBeenCalledWith(AuthConstants.RETRY_ERROR);
  });

  it('should open error popup on when forgotPassword throw error', () => {
    jest
      .spyOn(component['_authService'], 'forgotPassword')
      .mockImplementation(() => throwError('user does not exist'));

    const openSnackBarSpy = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation();

    component.initConfirmEmailForm();

    component.requestForgotPassword();

    expect(openSnackBarSpy).toHaveBeenCalledWith('user does not exist');
  });

  it('should request for password on click', () => {
    const initConfirmEmailFormSpy = jest
      .spyOn(component, 'requestForgotPassword')
      .mockImplementation();

    component.onClick(true);

    expect(initConfirmEmailFormSpy).toHaveBeenCalledWith();
  });

  it('should do not request for password on click', () => {
    const initConfirmEmailFormSpy = jest.spyOn(
      component,
      'requestForgotPassword'
    );

    component.onClick(false);

    expect(initConfirmEmailFormSpy).toHaveBeenCalledTimes(0);
  });
});
