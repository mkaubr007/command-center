import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CssConstant } from '../core/constants/css.constant';
import { LocalStorageConstants } from '../core/constants/local-storage.constants';
import { MessageConstant } from '../core/constants/message.constant';
import { LocalStorageService } from '../core/services/local-storage.service';
import { AssigneeDropdownCacheService } from '../services/assignee-dropdown-service/assignee-dropdown.cache.service';
import { SharedService } from '../shared/shared.service';
import { LogoutModalComponent } from './shared-home/components/logout-modal/logout-modal.component';
import { NotificationService } from './shared-home/services/notification/notification.service';
import { SocketService } from './shared-home/services/socket/socket.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private userId: string;
  private newConnectionSubscription$: Subscription;
  private pingSubscription$: Subscription;
  private newNotificationSubscription$: Subscription;
  private deactivateTeamMemberSubscription$: Subscription;
  private updateCSRSubscription$: Subscription;

  constructor(
    private socketService: SocketService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private notificationService: NotificationService,
    private assigneeDropdownCacheService: AssigneeDropdownCacheService,
    public _dialog: MatDialog,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.localStorageService.getItemInLocalStorageWithoutJSON(
      LocalStorageConstants.USER_ID
    );
    this.socketService.connectSocket(this.userId);
    this.pingSocket();
    this.newConnection();
    this.newNotification();
    this.setTeamMemberSubscription();
    this.logoutCSRonUpdate();
  }

  public pingSocket(): void {
    this.pingSubscription$ = this.socketService
      .subscribeSocketPing()
      .subscribe((data) => {
        if (data) {
          console.log(data);
          if (this.userId) {
            this.socketService.addNewConnection(this.userId);
          }
        }
      });
  }

  public newConnection(): void {
    this.newConnectionSubscription$ = this.socketService
      .newConnection()
      .subscribe((data) => {
        if (data) {
          console.log(data);
        }
      });
  }

  public newNotification(): void {
    this.newNotificationSubscription$ = this.socketService
      .subscribeNewNotification()
      .subscribe((data) => {
        if (data) {
          this.notificationService.userNotificationCount.next(true);
          this.sharedService.sucessToaster(data.message);
        }
      });
  }

  private logoutCSRonUpdate(): void {
    this.updateCSRSubscription$ = this.socketService
      .subscribeCSRUpdate()
      .subscribe((data) => {
        if (data) {
          this.openDeleteConfirmationPopup();
        }
      });
  }

  public openDeleteConfirmationPopup(): void {
    const dialogRef = this._dialog.open(LogoutModalComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title: MessageConstant.LOGOUT_TITLE,
        subTitle: MessageConstant.LOGOUT_CSR_SUBTITLE,
        btnTxt: MessageConstant.LOGOUT_BUTTON,
      },
    });
    dialogRef.afterClosed().subscribe((event: boolean) => {
      if (event) {
        dialogRef.close();
        this._authService.logoutUser().subscribe(
          (res) => {},
          (err) => {}
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.newConnectionSubscription$.unsubscribe();
    this.pingSubscription$.unsubscribe();
    this.newNotificationSubscription$.unsubscribe();
    this.deactivateTeamMemberSubscription$.unsubscribe();
    this.updateCSRSubscription$.unsubscribe();
  }

  public async setTeamMemberSubscription(): Promise<void> {
    this.deactivateTeamMemberSubscription$ = this.socketService
      .onDeactivateTeamMember()
      .subscribe(async () => {
        await this.assigneeDropdownCacheService.updateAssigneeCache();
      });
  }
}
