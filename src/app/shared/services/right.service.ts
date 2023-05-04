import { CustomHttpService } from '../../core/services/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IRights } from '../models/rights/right-service-rep';
import { Rights } from '../models/rights/right.model';
import { analyzeAndValidateNgModules } from '@angular/compiler';



@Injectable()
export class RightService {
    constructor(private http: CustomHttpService) { }

    public getRights(): Observable<IRights[]> {
        return this.http.get(`/rights`).pipe(
            map((response) => {
                return response['body']['data'].map(
                    (rights: IRights) => new Rights(rights));
            })
        );
    }

    public getAdminRights(): Observable<number> {
        return this.http.get(`/rights`).pipe(
            map((response) => {
              console.log(response['body']);
                return (<Array<IRights>> response['body'])
                    .map((rights: IRights) => (rights))
                    .map((rp: IRights) => rp.permissionBit)
                    .reduce((sum, current) => {
                      return sum + current
                    });
            }));
    }

}

