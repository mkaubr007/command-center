import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../auth/auth.service';
import { LocalStorageConstants } from '../../../../core/constants/local-storage.constants';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { IName } from '../../../../shared/models/auth/auth';
import { NotificationService } from '../../services/notification/notification.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.scss'],
})
export class ProfileWidgetComponent implements OnInit {
  public userName: string;
  public fullName: string;
  public userRole: string;
  public profilePic: string;
  public openNotificationPannel = false;
  public newNotificationCount = 10;
  private userId: string;

  constructor(
    public dialog: MatDialog,
    private _authService: AuthService,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService
    ) {}

  ngOnInit() {
    this.fetchStoredData();
    this.userId = this.localStorageService.getItemInLocalStorageWithoutJSON(
      LocalStorageConstants.USER_ID
    );
    this.newNotificationCount = +this.localStorageService.getItemInLocalStorageWithoutJSON(
      LocalStorageConstants.NEW_NOTIFICATION_COUNT
    );
    this.updateUserNotificationCount();
  }

  private fetchStoredData(data?: IName): void {
    const mataData = localStorage.getItem('metaData');

    if (mataData) {
      this.profilePic = mataData;
    }

    this.fullName = data ? data.first : localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name')[0]

    this.userName = data ? data.first : localStorage.getItem('first_name');
    if (data && data.last) {
      this.userName += ' ' + data.last[0] + '.';
    } else if (localStorage.getItem('last_name')) {
      this.userName += ' ' + localStorage.getItem('last_name')[0] + '.';
    }
    const role = localStorage.getItem('role');
    this.userRole =
      this.userName?.length > 12
        ? role
        : role?.split(' ').length > 1
        ? role
            .split(' ')
            .map((char) => char[0])
            .join('')
            .toUpperCase()
        : role;
  }

  public showEditProfilePopup(): void {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '490px',
      disableClose: true,
      data: {
        title: 'Edit Profile',
        btnTxt: 'Save',
        btnSubTxt: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchStoredData(result);
      }
    });
  }

  public showChangePasswordPopup(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '490px',
      disableClose: true,
      data: {
        title: 'Change password',
        btnTxt: 'Save',
        btnSubTxt: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  public logout(): void {
    this._authService.logoutUser().subscribe(
      (res) => {},
      (err) => {}
    );
  }

  public stopPropagation(event?: MouseEvent): void {
    event.stopPropagation();
  }

  public openNotification(): void {
    this.openNotificationPannel = !this.openNotificationPannel;
    if (this.openNotificationPannel && this.newNotificationCount) {
      this.notificationService.resetNewNotificationCount(this.userId).subscribe(data => {
        if (data) {
          this.newNotificationCount = 0;
          this.localStorageService.setItemInLocalStorageWithoutJSON(LocalStorageConstants.NEW_NOTIFICATION_COUNT, 0);
        }
      });
    }
  }

  private updateUserNotificationCount(): void {
    this.notificationService.userNotificationCount.subscribe(data => {
      if (data) {
        this.newNotificationCount = this.newNotificationCount + 1;
        this.localStorageService.setItemInLocalStorageWithoutJSON(LocalStorageConstants.NEW_NOTIFICATION_COUNT, this.newNotificationCount);
      }
    });
  }
}
