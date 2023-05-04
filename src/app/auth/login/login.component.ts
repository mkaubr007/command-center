import { Component, OnInit } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup,

  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MessageConstant } from '../../core/constants/message.constant';
import { RouteConstants } from '../../core/constants/route.constants';
import Utils from '../../home/shared-home/utils/utils';
import { TeamsUrlTab } from '../../shared/enums/teams-tab.enum';
import { SharedService } from '../../shared/shared.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isLoaderActive = false;
  public hide = true;
  public currentApplicationVersion: string = environment.appVersion;
  public messageConstantRef = MessageConstant;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _fb: FormBuilder,
    private _sharedService: SharedService
  ) {}

  ngOnInit(): void {
    if (this._authService.loggedIn()) {
      this._router.navigate([RouteConstants.TEAM_MANAGE], {
        queryParams: {
          _tab: TeamsUrlTab.TEAMS,
        },
      });
    }
    this.initLoginForm();
  }

  public loginUser(): void {
    this.startLoading();
    const subscription = this._authService.loginUser(this.loginForm.value);
    subscription.add(() => this.stopLoading());
  }

  public initLoginForm(): void {
    this.loginForm = this._fb.group({
      email: [
        null,
        [Validators.required, Utils.emptySpaceValidator(), Validators.email],
      ],
      password: [null, [Validators.required, Utils.emptySpaceValidator()]],
    });
  }

  get loginFormControl(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  public startLoading(): void {
    this.isLoaderActive = true;
  }
  public stopLoading(): void {
    this.isLoaderActive = false;
  }

  public redirectToForgotPassword(): void {
    this._router.navigate([RouteConstants.FORGOT_PASSWORD]);
  }
}
