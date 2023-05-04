import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageConstants } from '../../core/constants/local-storage.constants';
import { Right } from '../enums/right.enum';
import { RightService } from '../services/right.service';
import { RouteConstants } from 'src/app/core/constants/route.constants';
import { ErrorUrlTab } from '../enums/error-tab.enum';
import { AuthConstants } from 'src/app/auth/test.constants';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _rightService: RightService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    let hasPermission = false;
    const permissionsInbit = parseInt(
      localStorage.getItem(LocalStorageConstants.PERMISSION)
    );
    const adminPermission = parseInt(
      localStorage.getItem(LocalStorageConstants.ADMIN_PERMISSION)
    );

    hasPermission =
          (permissionsInbit & Right.CosaNostraRead) == Right.CosaNostraRead ||
          (permissionsInbit & Right.CosaNostraWrite) == Right.CosaNostraWrite ||
          (permissionsInbit & adminPermission) == adminPermission;

          if(!hasPermission) {
            this._router.navigate([RouteConstants.DASHBOARD], {
                queryParams: {
                  _tab: ErrorUrlTab.NEW,
                },
                fragment: AuthConstants.ACCESS_DENIED_FRAGMENT
            });
        }
        return hasPermission;
  }
}
