import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Utils from '../../../../home/shared-home/utils/utils';
import { Popup } from '../../../../shared/models/popup/popup.model';

@Component({
  selector: 'app-create-process',
  templateUrl: './create-process.component.html',
  styleUrls: ['./create-process.component.scss']
})
export class CreateProcessComponent implements OnInit {

  public dialogRef;
  public processData: Popup;
  public createNewProcess: FormGroup = this._fb.group({
    name: ['', [Validators.required, Utils.emptySpaceValidator()]],
    displayName: ['', [Validators.required, Utils.emptySpaceValidator()]],
    assembly: ['', [Validators.required, Utils.emptySpaceValidator()]],
    class: ['', [Validators.required, Utils.emptySpaceValidator()]],
    runnerAssembly: ['', [Validators.required, Utils.emptySpaceValidator()]],
    runner: ['', [Validators.required, Utils.emptySpaceValidator()]],
    // dependencies:[[], [Validators.required]],
    failureFatal: [true, [Validators.required]]
  });

  constructor(private _fb: FormBuilder, public _dialog: MatDialog, private _injector: Injector) {
    this.dialogRef = this._injector.get(MatDialogRef, null);
    this.processData = this._injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit(): void {
    if (this.processData.data && Object.keys(this.processData.data).length > 0) {
      this.createNewProcess.setValue({
        name: this.processData.data.name,
        displayName: this.processData.data.displayName,
        assembly: this.processData.data.assembly,
        class: this.processData.data.class,
        runnerAssembly: this.processData.data.runnerAssembly,
        runner: this.processData.data.runner,
        // dependencies: this.processData.data.dependencies,
        failureFatal: this.processData.data.failureFatal,
      });
    }
  }


  public closePopup(isClose: boolean): void {

    if (isClose) {
      if (this.createNewProcess.valid) {
        const newProcess = {
          _id: this.processData.data._id,
          name: this.createNewProcess.get('name').value,
          displayName: this.createNewProcess.get('displayName').value,
          assembly: this.createNewProcess.get('assembly').value,
          class: this.createNewProcess.get('class').value,
          runnerAssembly: this.createNewProcess.get('runnerAssembly').value,
          runner: this.createNewProcess.get('runner').value,
          // dependencies: this.createNewProcess.get('dependencies').value,
          failureFatal: this.createNewProcess.get('failureFatal').value,
        }
        this.dialogRef.close(newProcess);
      }
    }
    else {
      this.dialogRef.close(null);
    }
  }
}
