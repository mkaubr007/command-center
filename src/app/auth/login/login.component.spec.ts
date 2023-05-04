import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CustomHttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SharedHomeModule } from 'src/app/home/shared-home/shared-home.module';
import Utils from 'src/app/home/shared-home/utils/utils';
import { RouteConstants } from '../../core/constants/route.constants';
import { AuthService } from '../auth.service';
import { AuthConstants } from '../test.constants';
import { LoginComponent } from './login.component';

const initLoginForm = () => {
  const formBuilder: FormBuilder = new FormBuilder();
  const formFroup = formBuilder.group({
    email: [
      null,
      [Validators.required, Utils.emptySpaceValidator(), Validators.email],
    ],
    password: [null, [Validators.required, Utils.emptySpaceValidator()]],
  });

  return formFroup;
};

let isLoggedIn = true;

class MockAuthService {
  loginUser(): any {
    return of(AuthConstants.LOGIN_RESPONSE);
  }

  loggedIn(): boolean {
    return isLoggedIn;
  }
}

describe('Login Component', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{path: 'auth/forgot_password', component: LoginComponent},{path: 'dashboard', component: LoginComponent}]),
        MatDialogModule,
        SharedHomeModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatSnackBarModule
      ],
      providers: [
        LocalStorageService,
        MatDialog,
        CustomHttpService,
        { provide: AuthService, useClass: MockAuthService },
      ],
      declarations: [
        LoginComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.debugElement.componentInstance;
  }));

  it('should init confirm form', () => {

    component.initLoginForm();

    expect(component.loginForm.value).toEqual(initLoginForm().value);
  });

  it('should redirect on ngOnInit if user is logged in', () => {
    const loggedInSpy = jest.spyOn(component['_authService'], 'loggedIn').mockImplementation(() => true);
    const navigateSpy = jest.spyOn(component['_router'], 'navigate');

    component.ngOnInit();

    expect(loggedInSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith([RouteConstants.TEAM_MANAGE], AuthConstants.NAGIVATION_OPTIONS);
  });

  it('should initLoginForm on ngOnInit if user is not logged in', () => {
    isLoggedIn = false;
    const loggedInSpy = jest.spyOn(component['_authService'], 'loggedIn').mockImplementation(() => false);
    const initLoginFormSpy = jest.spyOn(component, 'initLoginForm').mockImplementation();

    component.ngOnInit();

    expect(loggedInSpy).toHaveBeenCalled();
    expect(initLoginFormSpy).toHaveBeenCalled();
  });

  it('should get loginFormControl', () => {
    component.initLoginForm();

    jest.spyOn(component, 'loginFormControl', 'get').mockReturnValue(component.loginForm.controls);

    expect(component.loginFormControl).toEqual(component.loginForm.controls);
  });

  it('should start loading', () => {
    component.startLoading();

    expect(component.isLoaderActive).toBeTruthy();
  });

  it('should stop loading', () => {
    component.stopLoading();

    expect(component.isLoaderActive).toBeFalsy();
  });

  it('should redirect to forget password page', () => {
    const navigateSpy = jest.spyOn(component['_router'], 'navigate');

    component.redirectToForgotPassword();

    expect(navigateSpy).toHaveBeenCalledWith([RouteConstants.FORGOT_PASSWORD]);
  });
});

