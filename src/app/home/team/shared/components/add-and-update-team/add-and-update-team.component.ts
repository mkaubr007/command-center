import { Component, OnInit, Injector } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { TeamsUrlTab } from '../../../../../shared/enums/teams-tab.enum';
import { TeamMember } from '../../../../../shared/models/team-member/team-member.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Popup } from '../../../../../shared/models/popup/popup.model';
import { TeamService } from '../../../team.service';
import Utils from '../../../../shared-home/utils/utils';
import { LocalStorageConstants } from '../../../../../core/constants/local-storage.constants';
import { SharedService } from '../../../../../shared/shared.service';
import {
  IProfileData,
  ICreatedByRole,
  IAddTeamMember,
} from '../../../../../shared/models/team-member/team-member';
import {
  IErrorResponse,
  Success,
} from '../../../../../shared/models/error/error.interface';
import { MessageConstant } from '../../../../../core/constants/message.constant';

@Component({
  selector: 'app-add-and-update-team',
  templateUrl: './add-and-update-team.component.html',
  styleUrls: ['./add-and-update-team.component.scss'],
})
export class AddAndUpdateTeamComponent implements OnInit {
  public addNewTeamMemberForm: FormGroup;

  public teamTabRef: typeof TeamsUrlTab = TeamsUrlTab;
  public uploadedImage: IProfileData;
  public memberRoles: ICreatedByRole[];
  public updateMemberData: TeamMember;
  public imageName: string;
  public messageConstantRef = MessageConstant;

  public dialogRef: MatDialogRef<any, any>;
  public data: Popup;

  constructor(
    private _injector: Injector,
    private _fb: FormBuilder,
    private _teamService: TeamService,
    private _sharedService: SharedService
  ) {
    this.dialogRef = this._injector.get(MatDialogRef);
    this.data = this._injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit(): void {
    this.updateMemberData = this.data['memberData'];
    this.setMemberRoles();
    this.initAddNewTeamMemberForm(this.updateMemberData);
  }

  public setMemberRoles(): void {
    this._teamService.getMemberRoles().subscribe(
      (response: ICreatedByRole[]) => {
        this.memberRoles = response;
      },
      (error) => {
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  public initAddNewTeamMemberForm(data?: TeamMember): void {
    this.addNewTeamMemberForm = this._fb.group({
      name: this.getNameFormGroup(),
      email: [
        { value: null, disabled: this.data.isDisabled },
        [Validators.required, Utils.emptySpaceValidator(), Validators.email],
      ],
      createdBy: this.getCreatedByOrRoleFormGroup(),
      role: this.getCreatedByOrRoleFormGroup(),
    });

    if (data) {
      this.addNewTeamMemberForm.patchValue(data);
    }
  }

  public getNameFormGroup(): FormGroup {
    return this._fb.group({
      first: [null, [Validators.required, Utils.emptySpaceValidator()]],
      last: [null],
    });
  }

  public getCreatedByOrRoleFormGroup(): FormGroup {
    return this._fb.group({
      id: [],
      name: [],
    });
  }

  get addNewTeamMemberFormControl(): { [key: string]: AbstractControl } {
    return this.addNewTeamMemberForm.controls;
  }

  public onRoleSelection(roleId: string): void {
    const roleValue = this.memberRoles.find((x) => x._id === roleId);
    this.addNewTeamMemberForm.get('role').patchValue({
      id: roleValue['_id'],
      name: roleValue['name'],
    });
  }

  public createAddNewTeamMemberData(): void {
    this.addNewTeamMemberForm.get('createdBy').patchValue({
      id: localStorage.getItem(LocalStorageConstants.USER_ID),
      name: ` ${localStorage.getItem(
        LocalStorageConstants.FIRST_NAME
      )} ${localStorage.getItem(LocalStorageConstants.LAST_NAME)}`,
    });
  }

  public addUpdateTeamMember(): void {
    this.createAddNewTeamMemberData();
    if (this.updateMemberData) {
      this._teamService
        .updateTeamMember(
          this.addNewTeamMemberForm.getRawValue(),
          this.updateMemberData._id
        )
        .subscribe(
          (response: IAddTeamMember) => {
            this.handleSuccess(response);
          },
          (error: IErrorResponse) => {
            this.handleError(error);
          }
        );
    } else {
      this._teamService
        .addTeamMember(this.addNewTeamMemberForm.value)
        .subscribe(
          (response: IAddTeamMember) => {
            this.handleSuccess(response);
          },
          (error: IErrorResponse) => {
            this.handleError(error);
          }
        );
    }
  }

  public closePopup(event?: boolean): void {
    if (event) {
      this._teamService.isMemberAdded = true;
      this.addUpdateTeamMember();
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }

  private handleSuccess(response: Success): void {
    this._sharedService.blockUI.stop();
    this._sharedService.openSuccessSnackBar(response);
  }

  private handleError(error: IErrorResponse): void {
    this._sharedService.blockUI.stop();
    this._sharedService.openErrorSnackBar(error);
  }
}
