import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPopupComponent } from 'src/app/home/shared-home/components/confirm-popup/confirm-popup.component';
import Utils from 'src/app/home/shared-home/utils/utils';
import { CssConstant } from '../../core/constants/css.constant';
import { MessageConstant } from '../../core/constants/message.constant';
import { StatusCodeConstant } from '../../core/constants/status-code.constant';
import { ChangePasswordConstants } from '../../home/shared-home/components/change-password/change-password.constants';
import { TeamService } from '../../home/team/team.service';
import { PasswordValidatorService } from '../../services/password-validator/password-validator.service';
import { ConfirmedValidator } from '../../shared/custom-validators/confirmed.validator';
import { IErrorResponse } from '../../shared/models/error/error.interface';
import { ApiResponse } from '../../shared/models/util/api-response';
import { SharedService } from '../../shared/shared.service';
import { AuthService } from '../auth.service';
import { AuthConstants } from '../test.constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public hidePassword = true;
  public hideNewPassword = true;
  public resetPasswordForm: FormGroup;
  public resetPasswordHash: string;
  public isLoaderActive = false;
  public userId: string;
  public changePasswordConstants = ChangePasswordConstants;
  private redirectUrlForMail: string;

  constructor(
    private _fb: FormBuilder,
    public _dialog: MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _passwordValidatorService: PasswordValidatorService,
    private _sharedService: SharedService,
    private _teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.initResetPasswordForm();

    this._activatedRoute.queryParams.subscribe((params) => {
      this.resetPasswordHash = params['token'];
      this.userId = params['auth'];
      if (!(this.resetPasswordHash && this.userId)) {
        this._sharedService.openErrorSnackBar(AuthConstants.ERROR);
      }
      if (params['status']) {
        this.redirectUrlForMail = window.location.origin;
      }
    });
  }

  public startLoading(): void {
    this.isLoaderActive = true;
  }

  public stopLoading(): void {
    this.isLoaderActive = false;
  }

  public initResetPasswordForm(): void {
    this.resetPasswordForm = this._fb.group(
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
  }

  get resetPasswordFormControl(): { [key: string]: AbstractControl } {
    return this.resetPasswordForm.controls;
  }

  public onClick(event: boolean): void {
    this.startLoading();
    const { password } = this.resetPasswordForm.value;
    const hash = this.resetPasswordHash;
    const userId = this.userId;
    const passwordErrors = this.resetPasswordForm.get('password').errors;
    const confirmPasswordErrors = this.resetPasswordForm.get('confirm_password').errors
    if (event && !passwordErrors && !confirmPasswordErrors) {
      const isValid = this._passwordValidatorService.validatePassword(password);
      if (isValid) {
        this._authService.resetPassword({ hash, userId, password, redirectUrlForMail: this.redirectUrlForMail }).subscribe(
          (result: ApiResponse<any>) => {
            if (result.statusCode === StatusCodeConstant.ERROR_IN_DATA) {
              result["error"] = "error";
              this._sharedService.openErrorSnackBar(result as IErrorResponse);
            }
            this.stopLoading();
            this.openConfirmationPopup(result.data);
          },
          (error) => {
            this._sharedService.openErrorSnackBar(error);
            this.stopLoading();
          }
        );
      }
    }
  }

  public openConfirmationPopup(email: string): void {
    this._dialog
      .open(ConfirmPopupComponent, {
        width: CssConstant.POPUP_WIDTH,
        disableClose: true,
        data: {
          title: MessageConstant.FORGET_PWD_CONFIRM_POPUP_TITLE,
          subTitle: MessageConstant.RESET_PWD_CONFIRM_POPUP_SUBTITLE,
          btnTxt: MessageConstant.RESET_PWD_CONFIRM_POPUP_BUTTON_TEXT,
        },
      })
      .afterClosed()
      .subscribe(() => {
        const { password } = this.resetPasswordForm.value;

        this.startLoading();
        const subscription = this._authService.loginUser({email, password});
        subscription.add(() => this.stopLoading());
      });
  }


}
