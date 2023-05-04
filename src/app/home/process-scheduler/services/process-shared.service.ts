import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomHttpService } from '../../../core/services/http.service';
import { IDistinctName } from '../../../shared/models/util/i-distinct-name.interface';

@Injectable({
  providedIn: 'root'
})
export class ProcessSharedService {

  public selectedClientEnvironment = new BehaviorSubject<any>('');
  
  constructor(private _http: CustomHttpService) { }
  
  public getSelectedClientEnvironment(): Observable<any> {
    return this.selectedClientEnvironment.asObservable();
  }

  public getDistinctClientsForSingleSelection(): Observable<IDistinctName[]> {
    return this._http.get<{ data: string[]}>('/clients/distinct/clients', { })
        .pipe(
          map((response) => {
            return response['body']['data'];
          })
        );
  }

  public getDistinctEnvironmentsForSingleSelection(): Observable<IDistinctName[]> {
    return this._http.get<{ data: string[]}>('/clients/distinct/environments', { })
        .pipe(
          map((response) => {
            return response['body']['data'];
          })
        );
  }
}
