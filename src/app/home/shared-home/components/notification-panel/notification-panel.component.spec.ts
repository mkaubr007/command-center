import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Observable, of } from 'rxjs';
import { INotificationResponseData } from '../../../../shared/models/notification/notification.interface';
import { SharedModule } from '../../../../shared/shared.module';
import { NotificationTestConstants } from '../../constants/notification-test.constant';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationDetailConstants } from '../notification-detail/notification-detail-test-constants';
import { NotificationInfiniteListComponent } from '../notification-infinite-list/notification-infinite-list.component';

import { NotificationPanelComponent } from './notification-panel.component';

class NotificationServiceSpy {
  getNotifications(): Observable<INotificationResponseData> {
    return of(NotificationTestConstants.NOTIFICATION_DATA);
  }
}
describe('NotificationPanelComponent', () => {
  let component: NotificationPanelComponent;
  let fixture: ComponentFixture<NotificationPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotificationPanelComponent,
        NotificationInfiniteListComponent,
      ],
      imports: [InfiniteScrollModule, SharedModule],
      providers: [
        { provide: NotificationService, useClass: NotificationServiceSpy },
      ],
    })
      .overrideTemplate(NotificationPanelComponent, '<div></div>')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shuould get notification data', () => {
    const getNotificationSpy = jest.spyOn(
      component['notificationService'],
      'getNotifications'
    );
    component['getNotification']();
    expect(getNotificationSpy).toHaveBeenCalled();
    expect(component.notificationData).toEqual(
      NotificationTestConstants.NOTIFICATION_DATA.result.groupNotifications
    );
  });

  it('should load more data', () => {
    component.page = 1;
    const getNotificationSpy = jest
      .spyOn<any, any>(component, 'getNotification')
      .mockImplementation();
    component.loadData();
    expect(getNotificationSpy).toHaveBeenCalled();
    expect(component.page).toEqual(2);
  });

  it('should close notifiaction pannel', () => {
    component['firstTime'] = true;
    component.closeNotification(new MouseEvent('document:click'));
    expect(component['firstTime']).toBeFalsy();
  });

  it('should show notification detail panel', () => {
    component.showNotificationDetailPanel(
      NotificationDetailConstants.CURRENT_NOTIFICATION as any
    );

    expect(component.showNotificationDetail).toBeTruthy();
    expect(component.currentNotification).toEqual(
      NotificationDetailConstants.CURRENT_NOTIFICATION
    );
  });

  it('should show notification list', () => {
    component.showNotificationList();

    expect(component.showNotificationDetail).toBeFalsy();
  });
});
