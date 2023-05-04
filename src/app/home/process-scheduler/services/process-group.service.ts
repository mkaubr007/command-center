import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomHttpService } from '../../../core/services/http.service';
import { IProcessGroup, IProcessGroupResponse, IProcessGroupResponseData, IProcessGroupResponses } from '../../../shared/models/processGroup/process-group-service-rep';
import { ProcessGroup } from '../../../shared/models/processGroup/process-group-model';
import { ApiResponse } from '../../../shared/models/util/api-response';


@Injectable({
  providedIn: 'root'
})
export class ProcessGroupService {

  public inputValue = new Subject<any>();
  constructor(private http: CustomHttpService
  ) { }

  public getInputValue(): Observable<any> {
    return this.inputValue.asObservable();
  }

  public getProcessGroup(
    client: string,
    environment: string,
    sort_by?: string,
    order_by?: number,
    limit?: number,
    page?: number,
    search_keyword?: string,
    status?: string
  ): Observable<IProcessGroupResponseData> {
    const params = { client, environment, search_keyword, status, sort_by, order_by, limit, page };
    return this.http
      .get<IProcessGroupResponse>('/process-groups', params)
      .pipe(
        map((response) => {
          const programGroupList = response['body']['data']['result'].map(
            (value: IProcessGroup) => {
              return new ProcessGroup(value);
            }
          );
          const processGroups = {
            result: programGroupList,
            count: response['body']['data']['count'],
          };
          return processGroups
        })
      );
  }

  public updateProcessGroup(id: string, newProcessGroup: IProcessGroup): Observable<IProcessGroupResponses> {

    return this.http.put<IProcessGroupResponses>(`/process-groups/${id}`, newProcessGroup);

  }

  public deleteProcessGroup(id: string): Observable<IProcessGroupResponses> {
    return this.http.delete<IProcessGroupResponses>(`/process-groups/${id}`);

  }

  public createNewProcessGroup(selectedClient: string, selectedEnvironment: string, newProcessGroup: IProcessGroup): Observable<IProcessGroupResponses> {
    newProcessGroup.client = selectedClient;
    newProcessGroup.environment = selectedEnvironment;
    newProcessGroup.isPublished = false;
    newProcessGroup.isDeleted = false;
    return this.http.post<IProcessGroupResponses>('/process-groups/', newProcessGroup);

  }

  public linkProcesses(processGroupId: string, linkedProcesses: any[]): Observable<ApiResponse<IProcessGroupResponses>> {

    return this.http
      .put<ApiResponse<IProcessGroupResponses>>(`/process-groups/${processGroupId}/link-processes`, linkedProcesses)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public publishUnpublishProcessGroup(processGroupId: string, isPublished: boolean)
  {
    return this.http
      .put<ApiResponse<IProcessGroupResponses>>(`/process-groups/${processGroupId}/publish`, {"isPublished":isPublished})
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public enableDisableProcess(processGroupId: string, processId: string, isEnabled: boolean): Observable<ApiResponse<IProcessGroupResponses>> {

    return this.http
      .put<ApiResponse<IProcessGroupResponses>>(`/process-groups/${processGroupId}/processes/${processId}/enable`, {isEnabled:isEnabled})
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

}
