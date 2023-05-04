import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Utils from '../../../../home/shared-home/utils/utils';
import { Popup } from '../../../../shared/models/popup/popup.model';

@Component({
  selector: 'app-create-argument',
  templateUrl: './create-argument.component.html',
  styleUrls: ['./create-argument.component.scss']
})
export class CreateArgumentComponent implements OnInit {

  public dialogRef;
  public argumentData: Popup;
  public argumentTypes = [
    { name: 'Complex' }, 
    { name: 'String' },
    { name: 'Int32' },
    { name: 'Int64' },
    { name: 'Boolean' },
    { name: 'Type' },
    { name: 'ConfigKeyString' },
    { name: 'ConfigKeyInt32' },
    { name: 'ConfigKeyBool' },
    { name: 'AwsKeyString' },
    { name: 'Enum' },
  ];
  public createNewArgument: FormGroup = this._fb.group({
    name: ['', [Validators.required, Utils.emptySpaceValidator()]],
    namespace:['', [Validators.required, Utils.emptySpaceValidator()]],
    argumentType:['', [Validators.required]],
    value:['', [Validators.required, Utils.emptySpaceValidator()]],
  });
  
  constructor(private _fb:FormBuilder, 
              public _dialog: MatDialog, 
              private _injector: Injector) { 
    this.dialogRef = this._injector.get(MatDialogRef, null);
    this.argumentData = this._injector.get(MAT_DIALOG_DATA, null);

  }

  ngOnInit(): void {
    if(this.argumentData.data && Object.keys(this.argumentData.data).length > 0) {
      this.createNewArgument.setValue({
        name: this.argumentData.data.name,
        namespace: this.argumentData.data.namespace,
        argumentType: this.argumentData.data.argumentType,
        value: this.argumentData.data.value
      });
    }
  }

  public closePopup(isClose: boolean): void {

    if(isClose) {
      if(this.createNewArgument.valid) {
        const newArgument = {
          ...this.argumentData.data,
          name: this.createNewArgument.get('name').value,
          namespace: this.createNewArgument.get('namespace').value,
          argumentType: this.createNewArgument.get('argumentType').value,
          value: this.createNewArgument.get('value').value
        }
        this.dialogRef.close(newArgument);
      }
      else {

      }
    } 
    else {
      this.dialogRef.close(null);
    }
  }

  public onArgumentSelection(event){

  }

}
