import {
  Component,
  OnInit,
  Input,
  ContentChild,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { NotificationConstants } from '../../../../core/constants/notification.constant';
import { RouteConstants } from '../../../../core/constants/route.constants';
import { INotification } from '../../../../shared/models/notification/notification.interface';

const moment = require('moment').default || require('moment');
@Component({
  selector: 'app-notification-infinite-list',
  templateUrl: './notification-infinite-list.component.html',
  styleUrls: ['./notification-infinite-list.component.scss'],
})
export class NotificationInfiniteListComponent implements OnInit {
  public throttle = 300;
  public scrollDistance = 2;
  public scrollUpDistance = 2;
  public listCount: number;
  public imageUrl = RouteConstants.NO_USER_IMAGE_PATH;

  @Input() height: number;
  @Input() notificationData: any;
  @Input() loading?: boolean;
  @Input() search: boolean;
  @Input() compact = false;
  @ContentChild('lineHeader', { static: false })
  lineHeaderTmpl: TemplateRef<any>;
  @ContentChild('lineContent', { static: false })
  lineContentTmpl: TemplateRef<any>;
  @Output() onScrollItems: EventEmitter<any> = new EventEmitter<any>();
  @Output('currentNotification') currentNotification: EventEmitter<INotification> = new EventEmitter<INotification>();

  constructor() {}

  ngOnInit() {}

  public loadData(): void {
    this.onScrollItems.emit();
  }

  public formatDate(date: string, category: string): string {
    let formatedDate = '';
    switch (category) {
      case NotificationConstants.NOTIFICATION_GROUP_NAME.TODAY:
        formatedDate = moment(new Date(date), 'YYYYMMDD').fromNow();
        if (formatedDate === NotificationConstants.FEW_SECOND_AGO) {
          formatedDate = NotificationConstants.JUST_NOW;
        }
        break;
      case NotificationConstants.NOTIFICATION_GROUP_NAME.YESTERDAY:
        formatedDate = moment(new Date(date)).format('LT');
        break;
      default:
        formatedDate = moment(new Date(date)).format('ll');
        break;
    }
    return formatedDate;
  }

  public showNotificationDetailPanel(notificationDetail: INotification): void {
    this.currentNotification.emit(notificationDetail);
  }

}
