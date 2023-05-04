import { CustomHttpService } from '../../core/services/http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { IRoles } from '../models/roles/role.-service-rep';
import { Role } from '../models/roles/role.model';


@Injectable()
export class RoleService {
  constructor(private http: CustomHttpService) { }

  public getRoles(): Observable<IRoles[]> {
    return this.http.get(`/roles`).pipe(
      map((response) => {
        return response['body']['data'].map(
          (roles: IRoles) => new Role(roles));
      })
    );
  }

  public getRole(name: string): Observable<IRoles> {
    return this.http.get(`/roles/${name}`).pipe(
      map((response) => {
        return response['body']['data'].map(
          (roles: IRoles) => new Role(roles));
      })
    );
  }

  
}
