import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import cronstrue from 'cronstrue';
import { Schedule, ScheduleExtended } from '../../../../shared/models/cosa-nostra/schedule-process-group';
import { ApiResponse } from '../../../../shared/models/util/api-response';
import { SharedService } from '../../../../shared/shared.service';
import { ScheduleProcessGroupService } from '../../services/schedule-process-group.service';

@Component({
  selector: 'app-schedule-progress-group',
  templateUrl: './schedule-progress-group.component.html',
  styleUrls: ['./schedule-progress-group.component.scss']
})
export class ScheduleProgressGroupComponent implements OnInit {
  public scheduleProcessGroupService: ScheduleProcessGroupService;
  public scheduleData: { data: { clientScheduleId: string, schedule: Schedule, processGroupId: string, client: string, environment: string } } = null;
  public scheduleTypes: { name: string, _id: string }[] = [{ name: 'OneTime', _id: 'OneTime' }, { name: 'Recurring', _id: 'Recurring' }];
  public selectedScheduleType: { name: string, _id: string };
  public scheduleCustomForm: FormGroup = this._fb.group({
    cronExpression: ['', Validators.required],
    scheduleType: ['', Validators.required]
  });
  public dialogRef;
  formattedCronExpression: {text: string, color: string, isValid: boolean} = { text: '', color: '', isValid: true};


  constructor(private _fb: FormBuilder, public _dialog: MatDialog,
    private _injector: Injector, private _scheduleProcessGroupService: ScheduleProcessGroupService,
    private _sharedService: SharedService) {
    this.dialogRef = this._injector.get(MatDialogRef, null);
    this.scheduleData = this._injector.get(MAT_DIALOG_DATA, null);
  }

  ngOnInit(): void {
    if (this.scheduleData && this.scheduleData.data && this.scheduleData.data.schedule) {
      let schedule = {
        cronExpression: this.scheduleData.data.schedule.cronExpression,
        scheduleType: this.scheduleData.data.schedule.scheduleType
      };
      this.selectedScheduleType = this.scheduleTypes.find(c => c._id == this.scheduleData.data.schedule.scheduleType);
      this.scheduleCustomForm.setValue(schedule);
      this.scheduleCustomForm.updateValueAndValidity();
      this.onCronExpressionChange(schedule.cronExpression);
    }
  }
  public closePopup(event?: boolean): void {
    this.dialogRef.close(true);
  }

  public handleSave(): void {
    if(this.scheduleCustomForm.invalid){
      return;
    }

    this.onCronExpressionChange(this.scheduleCustomForm.controls.cronExpression.value);
    if(!this.formattedCronExpression.isValid){
      return;
    }
    
    let cronExpression = this.scheduleCustomForm.controls.cronExpression.value;
    let scheduleType = this.scheduleCustomForm.controls.scheduleType.value;
    if (this.scheduleData.data.processGroupId) {
      this._scheduleProcessGroupService.addScheduleProcessGroup({ processGroupId: this.scheduleData.data.processGroupId, cronExpression: cronExpression, scheduleType: scheduleType, client: this.scheduleData.data.client, environment: this.scheduleData.data.environment } as ScheduleExtended)
        .subscribe(
          (response: ApiResponse<Schedule>) => {
            if (response.statusCode == 200) {
              this.dialogRef.close(response.data);
              this._sharedService.openSuccessSnackBar(response);
            }
          },
          (error) => {
            this._sharedService.openErrorSnackBar(error);
          }
        );

    }
    else {

      this._scheduleProcessGroupService.updateScheduleProcessGroup(this.scheduleData.data.clientScheduleId, this.scheduleData.data.schedule._id, { cronExpression: cronExpression, processGroupId: this.scheduleData.data.schedule.processGroupId, scheduleType: scheduleType } as Schedule)
        .subscribe(
          (response: ApiResponse<Schedule>) => {
            if (response.statusCode == 200) {
              this.scheduleData.data.schedule.cronExpression = cronExpression;
              this.scheduleData.data.schedule.scheduleType = scheduleType;
              this.dialogRef.close(this.scheduleData.data.schedule);
              this._sharedService.openSuccessSnackBar(response);
            }
          },
          (error) => {
            this._sharedService.openErrorSnackBar(error);
          }
        );
    }

  }

  public closePopupClicked(): void {
    this.dialogRef.close(null);
  }

  public onScheduleTypeSelection(event: any) {

  }

  public onCronExpressionChange(value:string){
    //#todo use ng form custom validation instead this solution.
    try{
      this.formattedCronExpression = {
        text :cronstrue.toString(value),
        color :'',
        isValid: true
      }
    }
    catch(err){
      this.formattedCronExpression = {
        text :err,
        color :'red',
        isValid: false
      }
    }
  }

}
