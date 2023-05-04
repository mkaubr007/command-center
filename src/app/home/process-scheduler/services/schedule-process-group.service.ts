import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../../shared/models/util/api-response';
import { CustomHttpService } from '../../../../app/core/services/http.service';
import { IScheduleProcessGroupResponse, Schedule, ScheduleExtended } from '../../../shared/models/cosa-nostra/schedule-process-group';

@Injectable({
  providedIn: 'root'
})
export class ScheduleProcessGroupService {
  public inputValue = new Subject<any>();
  constructor(private http: CustomHttpService) { }

  public getInputValue(): Observable<any> {
    return this.inputValue.asObservable();
  }

  public getClientSchedules(
    client: string,
    environment: string,
    sort_by?: string,
    order_by?: number,
    limit?: number,
    page?: number,
    search_keyword?: string,
    status?: string
    ): Observable<IScheduleProcessGroupResponse> {
    const params = { client, environment, search_keyword, status, sort_by, order_by, limit, page };
    return this.http
      .get<IScheduleProcessGroupResponse>('/schedules', params)
      .pipe(
        map((response) => {
          const scheduledProcessGroup = response['body']['data']['result'];
          const clientSchedules = {
            result: scheduledProcessGroup,
            count: response['body']['data']['count'],
          };
          return clientSchedules
        })
      );
  }

  public enableDisableSchedule(clientScheduleId: string, scheduleId: string, isEnabled: boolean): Observable<ApiResponse<Boolean>> {

    return this.http
      .put<ApiResponse<Boolean>>(`/schedules/${clientScheduleId}/schedule-process-group/${scheduleId}/enable`, {isEnabled:isEnabled})
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public deleteScheduledProcessGroup(clientScheduleId: string, scheduleId: string): Observable<ApiResponse<Boolean>> {

    return this.http
      .put<ApiResponse<Boolean>>(`/schedules/${clientScheduleId}/schedule-process-group/${scheduleId}/delete`, null)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public updateScheduleProcessGroup(clientScheduleId: string, scheduleId: string, schedule: Schedule): Observable<ApiResponse<Schedule>> {

    return this.http
      .put<ApiResponse<Schedule>>(`/schedules/${clientScheduleId}/schedule-process-group/${scheduleId}`, schedule)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public addScheduleProcessGroup(schedule: ScheduleExtended): Observable<ApiResponse<Schedule>> {

    return this.http
      .put<ApiResponse<Schedule>>(`/schedules/schedule-process-group/create`, schedule)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}