import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { CustomHttpService } from '../../../../core/services/http.service';
import { INotificationResponseData } from '../../../../shared/models/notification/notification.interface';
import { NotificationTestConstants } from '../../constants/notification-test.constant';

import { NotificationService } from './notification.service';

class CustomHttpServiceMock {
  get(): Observable<INotificationResponseData> {
      return of(NotificationTestConstants.NOTIFICATION_DATA);
  }
  put(): Observable<boolean> {
    return of(true);
  }
 }
describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomHttpService, useClass: CustomHttpServiceMock },
      ]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get notifications', () => {
    const getSpy = jest.spyOn<any, any>(service['http'], 'get');
    service.getNotifications();
    expect(getSpy).toHaveBeenCalled();
  });

  it('should reset notification count', () => {
    const putSpy = jest.spyOn<any, any>(service['http'], 'put');
    const userId = NotificationTestConstants.NOTIFICATION_DATA.result.groupNotifications[0].notifications[0].user[0].id;
    service.resetNewNotificationCount(userId);
    expect(putSpy).toHaveBeenCalled();
  });
});
