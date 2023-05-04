import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NotificationConstants } from '../../../../core/constants/notification.constant';
import { SharedHomeModule } from '../../shared-home.module';

import { NotificationDetailConstants } from '../notification-detail/notification-detail-test-constants';
import { NotificationInfiniteListComponent } from './notification-infinite-list.component';

describe('NotificationInfiniteListComponent', () => {
  let component: NotificationInfiniteListComponent;
  let fixture: ComponentFixture<NotificationInfiniteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        InfiniteScrollModule,
        SharedHomeModule
      ]
    })
      .overrideTemplate(NotificationInfiniteListComponent, '<div></div>')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationInfiniteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load more data', () => {
    const emitSpy = jest.spyOn(component.onScrollItems, 'emit');
    component.loadData();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should format date', () => {
    const currentDate = new Date();
    const formattedDate = component.formatDate(
      currentDate.toISOString(),
      NotificationConstants.NOTIFICATION_GROUP_NAME.TODAY
    );
    expect(formattedDate).toEqual(NotificationConstants.JUST_NOW);
  });

  it('should show notification detail panel', () => {
    const emitSpy = jest
      .spyOn(component.currentNotification, 'emit')
      .mockImplementation();
    component.showNotificationDetailPanel(
      NotificationDetailConstants.CURRENT_NOTIFICATION as any
    );
    expect(emitSpy).toHaveBeenCalled();
  });
});
