import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageConstants } from 'src/app/core/constants/local-storage.constants';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { CustomHttpService } from '../../../core/services/http.service';
import { ProcessArgument, ProcessArgumentsParams, ProcessArgumentsResponse } from '../../../shared/models/cosa-nostra/process-arguments.model';
import { ApiResponse } from '../../../shared/models/util/api-response';

@Injectable({
  providedIn: 'root'
})
export class ProcessArgumentsService {

  public searchValue = new Subject<any>();
  
  constructor(
    private http: CustomHttpService,
    private localStorageService: LocalStorageService
  ) { }

  public getSearchValue(): Observable<any> {
    return this.searchValue.asObservable();
  }

  public getArguments(
    environment: string,
    search_keyword?: string,
    sort_by?: string,
    order_by?: number,
    limit?: number,
    page?: number
  ): Observable<ProcessArgumentsParams> {
    const params = { environment, search_keyword, limit, order_by, sort_by, page };

    return this.http
      .get<ProcessArgumentsResponse>(`/arguments`, params)
      .pipe(
        map((response) => {
          const argumentsList = response['body']['data']['result'].map(
            (value: ProcessArgument) => new ProcessArgument(value)
          );
          const result = {
            result: argumentsList,
            count: response['body']['data']['count'],
          };
          return result;
        })
      );
  }

  public deleteArgument(id: string): Observable<ApiResponse<ProcessArgument>> {

    return this.http
      .delete<ApiResponse<ProcessArgument>>(`/arguments/${id}`)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public createArgument(environment: string, argument: ProcessArgument): Observable<ApiResponse<ProcessArgument>> {

    if(argument) {

      argument.isPublished = false;
      argument.isDeleted = false;
      argument.environment = environment;
      argument.createdBy = this.localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.EMAIL);
      argument.updatedBy = argument.createdBy;

      return this.http
        .post<ApiResponse<ProcessArgument>>(`/arguments`, argument)
        .pipe(
          map((response) => {
            return response;
          })
        );
    }
  }

  public editArgument(environment: string, argument: ProcessArgument): Observable<ApiResponse<ProcessArgument>> {

    if(argument) {

      argument.environment = environment;
      argument.updatedBy = this.localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.EMAIL);
      return this.http
        .put<ApiResponse<ProcessArgument>>(`/arguments/${argument._id}`, argument)
        .pipe(
          map((response) => {
            return response;
          })
        );
    }
  }

  public linkArguments(argumentId: string, linkedArguments: any[]): Observable<ApiResponse<ProcessArgument>> {

    const updatedByUser: string = this.localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.EMAIL);
    return this.http
      .put<ApiResponse<ProcessArgument>>(`/arguments/${argumentId}/link-arguments`, { arguments: linkedArguments, user: updatedByUser })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
