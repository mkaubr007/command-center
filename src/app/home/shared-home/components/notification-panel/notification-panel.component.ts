import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import {
  IGroupedNotification,
  INotification,
} from '../../../../shared/models/notification/notification.interface';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
})
export class NotificationPanelComponent implements OnInit {
  public notificationData: IGroupedNotification[] = [];
  public unreadNotificationCount = 0;
  public page = 1;
  public limit = 10;
  public loading: boolean;
  private firstTime = true;
  public showNotificationDetail: boolean;
  public currentNotification: INotification;

  @Output()
  closeNotificationPannel: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent): void {
    this.closeNotification(event);
  }

  constructor(
    private notificationService: NotificationService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.getNotification();
  }

  private async getNotification(): Promise<void> {
    this.loading = true;
    this.notificationService
      .getNotifications(this.limit, this.page)
      .subscribe((notification) => {
        if (notification && notification.result) {
          this.unreadNotificationCount = notification.result.unreadCount;
          const groupNotifications = notification.result.groupNotifications;
          if (this.notificationData.length) {
            groupNotifications.forEach((data) => {
              if (data.notifications.length) {
                const index = this.notificationData.findIndex(
                  (group) => group.groupName === data.groupName
                );
                if (this.notificationData[index]) {
                  this.notificationData[index].notifications.push(
                    ...data.notifications
                  );
                } else {
                  this.notificationData.push(data);
                }
              }
            });
          } else {
            this.notificationData = groupNotifications;
          }
        }
        this.loading = false;
      });
  }

  public loadData(): void {
    this.page = this.page + 1;
    this.getNotification();
  }

  public closeNotification(event: MouseEvent): void {
    // This is a hack for Notification panel close
    // Need to figure out better apprach
    if (
      !this.elementRef.nativeElement.contains(event.target) &&
      !this.firstTime &&
      !event.target['classList'].value.includes('overlay')
    ) {
      this.closeNotificationPannel.emit(true);
    } else {
      this.firstTime = false;
    }
  }

  public showNotificationDetailPanel(notificationDetail: INotification): void {
    this.showNotificationDetail = true;
    this.currentNotification = notificationDetail;
  }

  public showNotificationList(): void {
    this.showNotificationDetail = false;
  }
}
