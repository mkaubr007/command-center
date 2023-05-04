import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Popup } from '../../../../shared/models/popup/popup.model';
import { IProcessGroup } from '../../../../shared/models/processGroup/process-group-service-rep';
import Utils from '../../../../home/shared-home/utils/utils';

@Component({
  selector: 'app-create-process-group',
  templateUrl: './create-process-group.component.html',
  styleUrls: ['./create-process-group.component.scss']
})
export class CreateProcessGroupComponent implements OnInit {

  
  public processGroup: IProcessGroup;
  public processGroupData: Popup;
  public dialogRef = null;
  public numberRegEx = /\-?\d*\.?\d{1,2}/;
  public createNewProcessGroup: FormGroup = this._fb.group({
    name: ['', [Validators.required, Utils.emptySpaceValidator()]],
    parallelism:[null, [Validators.required, Validators.pattern(this.numberRegEx), Utils.emptySpaceValidator()]],
  });

  constructor(
    private _fb:FormBuilder, 
    public _dialog: MatDialog,
    private _injector: Injector) { 

    this.dialogRef = this._injector.get(MatDialogRef, null);
    this.processGroupData = this._injector.get(MAT_DIALOG_DATA, null);
  
  }

  ngOnInit(): void {
    if(this.processGroupData.data && Object.keys(this.processGroupData.data).length > 0) {
      this.createNewProcessGroup.setValue({
        name: this.processGroupData.data?.name,
        parallelism: this.processGroupData.data?.parallelism,
      });

    }
  }

  public closePopup(isClose: boolean): void {

    if(isClose) {
      if(this.createNewProcessGroup.valid) {
        const newProcessGroup = {
          ...this.processGroupData.data,
          name: this.createNewProcessGroup.get('name').value,
          parallelism: Number(this.createNewProcessGroup.get('parallelism').value as number),
        }
        this.dialogRef.close(newProcessGroup);
      }
      else {
      }
    } 
    else {
      this.dialogRef.close(null);
    }
  }
}
