import { LocalStorageConstants } from './../../../../../core/constants/local-storage.constants';
import { Component, OnInit, Injector } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { TeamsUrlTab } from '../../../../../shared/enums/teams-tab.enum';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Popup } from '../../../../../shared/models/popup/popup.model';
import Utils from '../../../../shared-home/utils/utils';
import { MessageConstant } from '../../../../../core/constants/message.constant';
import { TeamService } from '../../../team.service';
import { SharedService } from '../../../../../shared/shared.service';
import {
  IClientServiceRep,
  IClient,
} from 'src/app/shared/models/client-service-rep/client-service-rep';
import { IName } from 'src/app/shared/models/auth/auth';
import { SocketService } from '../../../../shared-home/services/socket/socket.service';

@Component({
  selector: 'app-add-and-update-client',
  templateUrl: './add-and-update-client.component.html',
  styleUrls: ['./add-and-update-client.component.scss'],
})
export class AddAndUpdateClientComponent implements OnInit {
  public addNewClientForm: FormGroup;
  public teamTabRef = TeamsUrlTab;
  public messageConstantRef = MessageConstant;

  /*Can't define type with knowing the repsonse*/
  public clientRep: IClientServiceRep[];

  private dialogRef = null;
  private match = { 'role.name': 'Client service representative' };
  private projection = { _id: 1, name: 1 };
  private sort = { 'name.first': 1 };
  private client: IClient;
  public data: Popup;

  constructor(
    private _injector: Injector,
    private _fb: FormBuilder,
    private _teamService: TeamService,
    private _sharedService: SharedService,
    private _socketService: SocketService
  ) {
    this.dialogRef = this._injector.get(MatDialogRef, null);
    this.data = this._injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit(): void {
    this.client = this.data['client'];
    this.initAddUpdateClientForm();
    this.setClientRep();
  }

  public setClientRep(): void {
    this._teamService
      .searchTeamMembers(this.match, this.projection, this.sort)
      .subscribe(
        (response: IClientServiceRep[]) => {
          const result = [];
          response.forEach((member) => {
            const name = this.getFullName(member.name as IName);
            result.push({ name: name, _id: member._id });
          });
          this.clientRep = result;
        },
        (error) => {
          this._sharedService.openErrorSnackBar(error);
        }
      );
  }

  private getFullName(name: IName): string {
    if (name.first && name.last) {
      return name.first + ' ' + name.last;
    }
    return name.first;
  }

  private initAddUpdateClientForm(): void {
    this.addNewClientForm = this._fb.group({
      name: [
        this.client ? this.client.name : null,
        [Validators.required, Utils.emptySpaceValidator()],
      ],
      serviceRepresentative: this.getClientRepFormGroup(),
      email: [null],
    });
    if (this.client) {
      this.addNewClientForm.get('name').disable();
    }
  }

  private getClientRepFormGroup(): FormGroup {
    return this._fb.group({
      id: [
        this.client ? this.client.serviceRepresentative.id : null,
        Validators.required,
      ],
      name: [
        this.client ? this.client.serviceRepresentative.name : null,
        Validators.required,
      ],
    });
  }

  get addNewClientFormControl(): { [key: string]: AbstractControl } {
    return this.addNewClientForm.controls;
  }

  public onCSRSelection(clientId: string): void {
    const clientValue = this.clientRep.find((x) => x._id === clientId);
    this.addNewClientForm.get('serviceRepresentative').patchValue({
      id: clientValue['_id'],
      name: clientValue['name'],
    });
  }

  public createClient(): void {
    const client: IClient = {
      ...this.addNewClientForm.value,
      createdBy: {
        id: localStorage.getItem(LocalStorageConstants.USER_ID),
        name: `${localStorage.getItem(
          LocalStorageConstants.FIRST_NAME
        )} ${localStorage.getItem(LocalStorageConstants.LAST_NAME)}`,
      },
    };
    if ('email' in client && !client['email']) {
      delete client['email'];
    }
    this._teamService.createClient(client).subscribe(
      (response) => {
        this.dialogRef.close(true);
        this._sharedService.openSuccessSnackBar(response);
      },
      (error) => {
        this.dialogRef.close(false);
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  public closePopup(event?: boolean): void {
    if (event) {
      if (this.client) {
        this.updateClient();
      } else {
        this.createClient();
      }
    } else {
      this.dialogRef.close();
    }
  }

  private updateClient(): void {
    const oldCSRId = this.client.serviceRepresentative.id;
    this.client.serviceRepresentative = this.addNewClientForm.value.serviceRepresentative;
    this._teamService.updateClient(this.client._id, this.client).subscribe(
      (response) => {
        this._socketService.emitCSRUpdate(oldCSRId);
        this.dialogRef.close(true);
        this._sharedService.openSuccessSnackBar(response);
      },
      (error) => {
        this.dialogRef.close(false);
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }
}
