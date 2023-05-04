import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthConstants } from '../../auth/test.constants';
import { LocalStorageConstants } from '../../core/constants/local-storage.constants';
import { RoleConstants } from '../../core/constants/role.constant';
import { RouteConstants } from '../../core/constants/route.constants';
import { ErrorUrlTab } from '../enums/error-tab.enum';

@Injectable({
    providedIn: 'root'
})
export class RouteGuard implements CanActivate {

    constructor(
        private _router: Router
    ) {
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        const isAccess = (localStorage.getItem(LocalStorageConstants.ROLE).toLowerCase() === RoleConstants.ADMIN);
        if(!isAccess) {
            this._router.navigate([RouteConstants.DASHBOARD], {
                queryParams: {
                  _tab: ErrorUrlTab.NEW,
                },
                fragment: AuthConstants.ACCESS_DENIED_FRAGMENT
            });
        }
        return true;
    }
}
