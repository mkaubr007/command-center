import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Injector } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Popup } from '../../../../shared/models/popup/popup.model';
import { MessageConstant } from '../../../../core/constants/message.constant';
import { TeamService } from '../../../team/team.service';
import { SharedService } from '../../../../shared/shared.service';
import { IName } from '../../../../shared/models/auth/auth';
import { LocalStorageConstants } from '../../../../core/constants/local-storage.constants';
import { IErrorResponse } from '../../../../shared/models/error/error.interface';
import { IAddTeamMember } from '../../../../shared/models/team-member/team-member';
import { TeamMember } from '../../../../shared/models/team-member/team-member.model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  public dialogRef: MatDialogRef<any, any>;
  public editProfileForm: FormGroup;
  public messageConstantRef = MessageConstant;
  public data: Popup;
  public userId: string;
  public firstName: string;
  public lastName: string;
  public profilePicture: FormData;
  public isLoaderActive = false;
  public metaData: string;
  public uniqueName: string;

  constructor(
    private _injector: Injector,
    private _formBuilder: FormBuilder,
    private _teamService: TeamService,
    private _sharedService: SharedService
  ) {
    this.dialogRef = this._injector.get(MatDialogRef);
    this.data = this._injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem(LocalStorageConstants.USER_ID);
    this.metaData = localStorage.getItem(LocalStorageConstants.META_DATA);
    this.initForm();
  }

  private initForm(): void {
    this.editProfileForm = this._formBuilder.group({
      profile: [this.metaData],
      firstName: [
        localStorage.getItem(LocalStorageConstants.FIRST_NAME),
        Validators.required,
      ],
      lastName: [
        localStorage.getItem(LocalStorageConstants.LAST_NAME),
        Validators.required,
      ],
      email: [
        {
          value: localStorage.getItem(LocalStorageConstants.EMAIL),
          disabled: true,
        },
        Validators.required,
      ],
    });
  }

  public updateUserData(): void {
    if (this.profilePicture) {
      this.uploadProfilePicture(this.profilePicture);
    } else {
      this.updateUserInfo();
    }
  }

  public updateUserInfo(): void {
    const data = {
      name: {
        first: this.editProfileForm.get('firstName').value,
        last: this.editProfileForm.get('lastName').value,
      },
      meta: {
        profilePic: this.editProfileForm.get('profile').value,
        uniqueName: this.uniqueName,
      },
    };
    this._teamService.updateTeamMember(data, this.userId).subscribe(
      (response: IAddTeamMember) => {
        if (response) {
          this.storeUpdatedName(response.data);
          this.stopLoading();
        }
        this._sharedService.openSuccessSnackBar(response);
        this.closePopup(response.data.name);
      },
      (error: IErrorResponse) => {
        this._sharedService.openErrorSnackBar(error);
        this.closePopup(false);
      }
    );
  }

  public async uploadProfilePicture(data: FormData): Promise<any> {
    try {
      this.startLoading();
      const response = await this._teamService.uploadProfile(data);
      this.metaData = response.data.url;
      this.uniqueName = response.data.uniqueName;
      this.editProfileForm.get('profile').setValue(this.metaData);
      this.updateUserInfo();
    } catch (error) {
      this._sharedService.openErrorSnackBar(error);
      this.closePopup(false);
    }
  }

  public startLoading(): void {
    this.isLoaderActive = true;
  }
  public stopLoading(): void {
    this.isLoaderActive = false;
  }

  public getImageData(event: FormData) {
    if (event) {
      this.profilePicture = event;
    }
  }

  private storeUpdatedName(data: TeamMember): void {
    localStorage.setItem(LocalStorageConstants.FIRST_NAME, data.name.first);
    localStorage.setItem(LocalStorageConstants.LAST_NAME, data.name.last);
    localStorage.setItem(LocalStorageConstants.META_DATA, data.meta.profilePic);
  }

  public closePopup(value?: IName | boolean): void {
    this.dialogRef.close(value ? value : null);
  }
}
