import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { AuthService } from '../../../../auth/auth.service';
import { MessageConstant } from '../../../../core/constants/message.constant';
import { NotificationSource } from '../../../../shared/enums/notification.enum';
import { TeamMemberStatus } from '../../../../shared/enums/teams-tab.enum';
import { IAssigneeDropdown } from '../../../../shared/models/client-service-rep/client-service-rep';
import {
  IErrorDetail,
  IErrorDetailResponse,
} from '../../../../shared/models/error-detail/error-detail.interface';
import {
  IErrorResponse,
  Success,
} from '../../../../shared/models/error/error.interface';
import { INotification, IUpdateStatusParams } from '../../../../shared/models/notification/notification.interface';
import { IStatus } from '../../../../shared/models/status/status.interface';
import { StatusService } from '../../../../shared/services/status.service';
import { SharedService } from '../../../../shared/shared.service';
import { ErrorService } from '../../../dashboard/shared/components/errors-tab/error.service';
import { ErrorConstants } from '../../../dashboard/shared/components/errors-tab/shared/constants/error.constants';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss'],
})
export class NotificationDetailComponent implements OnInit {
  public toggleDesc: boolean;
  public status: IStatus[];
  public errorDetail: IErrorDetail;
  public oldErrorStatus: string;
  public readonly ERROR_CONSTANT = ErrorConstants;
  public loading = true;

  @Input('currentNotification') currentNotification: INotification;
  @Output('goBack') goBack: EventEmitter<boolean> = new EventEmitter();

  constructor(
    public errorService: ErrorService,
    private _statusService: StatusService,
    private _sharedService: SharedService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getStatuses();
    this.getErrorDetailFromService();
  }

  public async getStatuses(): Promise<void> {
    try {
      const statuses: IStatus[] = await this._statusService
        .getStatuses({ match: { type: 'manual' } })
        .toPromise();
      if (statuses.length) {
        this.status = statuses;
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  public getErrorDetailFromService(): void {
    this.errorService
      .getErrorDetail(this.currentNotification.errorId)
      .subscribe((value: IErrorDetail) => {
        this.errorDetail = value;
        this.loading = false;
      });
  }

  public handleError(error: IErrorResponse): void {
    this._sharedService.openErrorSnackBar(error);
  }

  public handleSuccess(success: Success): void {
    this._sharedService.openSuccessSnackBar(success);
  }

  public showNotificationList(): void {
    this.goBack.emit(true);
  }

  public toggleDescending(): void {
    this.toggleDesc = !this.toggleDesc;
  }

  public async onAssigneeChange(
    { id, name, imageUrl }: IAssigneeDropdown,
    _errodId: string
  ): Promise<void> {
    try {
      const user = this._authService.getUserData();
      const updatedAssignee: IErrorDetailResponse = await this.errorService
        .updateErrorDetail(
          _errodId,
          {
            assignedTo: {
              id,
              name,
              avatar: imageUrl,
            },
          },
          {
            notificationSource: NotificationSource.UPDATE_ASSIGNEE,
            name: user.name.first + ' ' + user.name.last,
            profilePic: user.meta.profilePic,
          }
        )
        .toPromise();
      if (updatedAssignee) {
        this.errorDetail.assignedTo = updatedAssignee.data.assignedTo;
        this.handleSuccess(updatedAssignee);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  public getOldErrorStatus(): void {
    this.oldErrorStatus = cloneDeep(this.errorDetail.status);
  }

  public async onStatusChange(status: string, id: string): Promise<void> {
    if (
      !this.errorDetail.assignedTo ||
      !this.errorDetail.assignedTo.id ||
      !this.errorDetail.assignedTo.name
    ) {
      this.errorDetail.status = MessageConstant.PENDING;
    }

    try {
      const updateStatusParams = this.getUpadateStatusParams();

      const updatedStatus: IErrorDetailResponse = await this.errorService
        .updateErrorDetail(
          id,
          {
            status,
            clientName: this.errorDetail.clientName,
            serviceName: this.errorDetail.serviceName,
            environment: this.errorDetail.environment,
            oldErrorStatus: this.oldErrorStatus,
            errorTimestamps: this.errorDetail.errorTimestamps,
          },
          updateStatusParams
        )
        .toPromise();

      if (updatedStatus) {
        this.handleSuccess(updatedStatus);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private getUpadateStatusParams(): IUpdateStatusParams {
    const user = this._authService.getUserData();
    let updateStatusParams: IUpdateStatusParams;
    if (
      user._id != this.errorDetail.assignedTo.id &&
      this.errorDetail.assignedTo.status != TeamMemberStatus.INACTIVE
    ) {
      updateStatusParams = {
        notificationSource: NotificationSource.UPDATE_STATUS,
        name: user.name.first + ' ' + user.name.last,
        profilePic: user.meta.profilePic,
      };
    }
    return updateStatusParams;
  }
}
