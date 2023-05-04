import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomHttpService } from '../../../core/services/http.service';
import { ProcessArgument } from '../../../shared/models/cosa-nostra/process-arguments.model';
import { Processes, ProcessParams, ProcessResponse } from '../../../shared/models/cosa-nostra/process.model';
import { ApiResponse } from '../../../shared/models/util/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  public searchValue = new Subject<any>();

  constructor(private http: CustomHttpService) { }

  public getSearchValue(): Observable<any> {
    return this.searchValue.asObservable();
  }

  public getAllProcesses(
    environment: string,
    search_keyword?: string,
    sort_by?: string,
    order_by?: number,
    limit?: number,
    page?: number,
    status?: string
  ): Observable<ProcessParams> {
    const params = { environment, search_keyword, limit, order_by, sort_by, page, status };

    return this.http
      .get<ProcessResponse>(`/processes`, params)
      .pipe(
        map((response) => {
          const processList = response['body']['data']['result'].map(
            (value: Processes) => new Processes(value)
          );
          const result = {
            result: processList,
            count: response['body']['data']['count'],
          };
          return result;
        })
      );
  }

  public createProcess(environment: string, process: Processes): Observable<ApiResponse<Processes>> {

    if (process) {
      process.environment = environment;
      return this.http
        .post<ApiResponse<Processes>>(`/processes`, process)
        .pipe(
          map((response) => {
            return response;
          })
        );
    }
  }

  public editProcess(environment: string, process: Processes): Observable<ApiResponse<Processes>> {

    if (process) {
      process.environment = environment;
      return this.http
        .put<ApiResponse<Processes>>(`/processes/${process._id}`, process)
        .pipe(
          map((response) => {
            return response;
          })
        );
    }
  }

  public publishUnpublishProcess(id: string, isPublished: boolean): Observable<ApiResponse<Processes>> {
    return this.http
      .put<ApiResponse<Processes>>(`/processes/${id}/publish`, { isPublished: isPublished })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public deleteProcess(id: string): Observable<ApiResponse<Processes>> {

    return this.http
      .delete<ApiResponse<Processes>>(`/processes/${id}`)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public linkArguments(processId: string, linkedArguments: any[]): Observable<ApiResponse<ProcessArgument>> {

    return this.http
      .put<ApiResponse<ProcessArgument>>(`/processes/${processId}/link-arguments`, { arguments: linkedArguments })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

}