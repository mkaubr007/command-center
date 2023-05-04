import { CustomHttpService } from '../../core/services/http.service';
import { Observable } from 'rxjs';
import { IResponse } from '../models/response/response.interface';
import { IStatus } from '../models/status/status.interface';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Status } from '../models/status/status.model';

@Injectable()
export class StatusService {
  constructor(private http: CustomHttpService) { }

  public getStatuses(params: any): Observable<Status[]> {
    return this.http.get(`/status`, { params: JSON.stringify(params) }).pipe(
      map((response) => {
        return response['body']['data'].map(
          (statuses: IStatus) => new Status(statuses));
      })
    );
  }

  public deleteStatus(id: string): Observable<IResponse<IStatus>> {
    return this.http.delete(`/status/${id}`);
  }
}
