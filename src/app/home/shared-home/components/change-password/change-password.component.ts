import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../../auth/auth.service';
import { LocalStorageConstants } from '../../../../core/constants/local-storage.constants';
import { ChangePasswordConstants } from "./change-password.constants";
import { MessageConstant } from '../../../../core/constants/message.constant';
import { StatusCodeConstant } from '../../../../core/constants/status-code.constant';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { PasswordValidatorService } from '../../../../services/password-validator/password-validator.service';
import { ConfirmedValidator } from '../../../../shared/custom-validators/confirmed.validator';
import { IErrorResponse } from '../../../../shared/models/error/error.interface';
import { Popup } from '../../../../shared/models/popup/popup.model';
import { ApiResponse } from '../../../../shared/models/util/api-response';
import { SharedService } from '../../../../shared/shared.service';
import Utils from '../../utils/utils';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;
  public hide = false;
  public hide_new = false;
  public hide_renew = false;
  public changePasswordConstants = ChangePasswordConstants;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Popup,
    private _fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private _authService: AuthService,
    private _sharedService: SharedService,
    private _passwordValidatorService: PasswordValidatorService
  ) {}

  ngOnInit(): void {
    this.initChangePasswordForm();
  }

  private initChangePasswordForm(): void {
    this.changePasswordForm = this._fb.group(
      {
        current_password: [
          null,
          [Validators.required, Utils.emptySpaceValidator()],
        ],
        new_password: [
          null,
          [Validators.required, Utils.emptySpaceValidator()],
        ],
        confirm_password: [
          null,
          [Validators.required, Utils.emptySpaceValidator()],
        ],
      },
      {
        validator: ConfirmedValidator('new_password', 'confirm_password')
      },
    );
  }

  get changePasswordFormControl() {
    return this.changePasswordForm.controls;
  }

  public async closePopup(event: boolean): Promise<void> {
    if(event) {
      const newPassword = this.changePasswordForm.get('new_password').value;
      const confirmPassword = this.changePasswordForm.get('confirm_password').value
      const isValid = this._passwordValidatorService.validatePassword(confirmPassword);
      if(isValid && newPassword === confirmPassword) {
        await this.verifyCurrentPassword();
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }

  private async verifyCurrentPassword(): Promise<void> {
    try{
      const params = {
        currentPassword: this.changePasswordForm.get('current_password').value,
        newPassword: this.changePasswordForm.get('new_password').value,
        userId: this.localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID)
      };
      const result: ApiResponse<any> = await this._authService.changePassword(params).toPromise();
      if(result && result.statusCode === StatusCodeConstant.ERROR_IN_DATA) {
        result["error"] = "error";
        this._sharedService.openErrorSnackBar(result as IErrorResponse);
      }
      if(result && result.message === MessageConstant.RESPONSE_SUCCESS) {
        this._sharedService.openSuccessSnackBar(result);
      }
    } catch(error) {
      this._sharedService.openErrorSnackBar(error);
    }
  } 
}
