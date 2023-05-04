import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomHttpService } from '../../../../core/services/http.service';
import { INotificationResponseData } from '../../../../shared/models/notification/notification.interface';
import { IMappedResponseData } from '../../../../shared/models/response/mapped-response.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public userNotificationCount = new Subject<boolean>();

  constructor(private http: CustomHttpService) { }

  public getNotifications(
    limit?: number,
    page?: number): Observable<INotificationResponseData> {
    const params = { limit, page };
    return this.http
      .get<{
        data: any[];
      }>('/notifications', params)
      .pipe(
        map((response: HttpResponse<IMappedResponseData<INotificationResponseData>>) => {
          return response.body?.data;
        })
      );
  }

  public resetNewNotificationCount(userId: string): Observable<boolean> {
    return this.http.put<boolean>(`/users/${userId}/reset-notification`, {});
  }
}
