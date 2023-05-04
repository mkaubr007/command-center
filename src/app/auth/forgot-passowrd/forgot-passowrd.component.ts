import { LocalStorageService } from './../../core/services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from '../../home/shared-home/components/confirm-popup/confirm-popup.component';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LocalStorageConstants } from '../../core/constants/local-storage.constants';
import Utils from '../../home/shared-home/utils/utils';
import { RouteConstants } from '../../core/constants/route.constants';
import { SharedService } from '../../shared/shared.service';
import { IErrorResponse } from '../../shared/models/error/error.interface';
import { AuthConstants } from '../test.constants';
import { MessageConstant } from '../../core/constants/message.constant';
import { CssConstant } from '../../core/constants/css.constant';
@Component({
  selector: 'app-forgot-passowrd',
  templateUrl: './forgot-passowrd.component.html',
  styleUrls: ['./forgot-passowrd.component.scss'],
})
export class ForgotPassowrdComponent implements OnInit {
  public email: string;
  public confirmEmailForm: FormGroup;
  public messageConstantsRef = MessageConstant;

  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _localStorage: LocalStorageService,
    private _sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.initConfirmEmailForm();
  }
  public onClick(event: boolean): void {
    if (event) {
      this.requestForgotPassword();
    }
  }

  public requestForgotPassword(): void {
    this._sharedService.blockUI.start();
    this._authService.forgotPassword(this.confirmEmailForm.value).subscribe(
      (response) => {
        if (response.message === MessageConstant.RESPONSE_SUCCESS) {
          this._localStorage.setItemInLocalStorage(
            LocalStorageConstants.USER_ID,
            response.userId
          );
          this.openConfirmationPopup();
        } else if (response.message === MessageConstant.RESPONSE_FAILURE) {
          this._sharedService.openErrorSnackBar(AuthConstants.RETRY_ERROR);
        }
        this._sharedService.blockUI.stop();
      },
      (error: IErrorResponse) => {
        this._sharedService.blockUI.stop();
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  public initConfirmEmailForm(): void {
    this.confirmEmailForm = this._fb.group({
      email: [
        '',
        [Validators.required, Utils.emptySpaceValidator(), Validators.email],
      ],
      redirectURL: [
        `${window.location.origin}/${RouteConstants.RESET_PASSWORD}`,
      ],
    });
  }

  get confirmEmailFormControl(): { [key: string]: AbstractControl } {
    return this.confirmEmailForm.controls;
  }

  openConfirmationPopup() {
    this._sharedService.blockUI.stop();
    this._dialog
      .open(ConfirmPopupComponent, {
        width: CssConstant.POPUP_WIDTH,
        disableClose: true,
        data: {
          title: MessageConstant.FORGET_PWD_CONFIRM_POPUP_TITLE,
          subTitle:
            MessageConstant.FORGET_PWD_CONFIRM_POPUP_SUBTITLE,
          btnTxt: MessageConstant.FORGET_PWD_CONFIRM_POPUP_BUTTON_TEXT,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this._router.navigate([RouteConstants.LOGIN]);
      });
  }

  public redirectToHomePage() {
    this._router.navigate([RouteConstants.LOGIN]);
  }
}
