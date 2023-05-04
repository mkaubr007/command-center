import { RightService } from './../shared/services/right.service';
import { IChangePasswordParam, IUser } from './../shared/models/auth/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstants } from '../core/constants/route.constants';
import { tap, map } from 'rxjs/operators';
import { CustomHttpService } from '../core/services/http.service';
import { LocalStorageConstants } from '../core/constants/local-storage.constants';
import { CacheService } from './../../app/home/cache-service';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  IForgotOrResetPasswordData,
  IForgotOrResetPassword,
  IUserLogin,
  IAuth,
  IResetPasswordParam
} from '../shared/models/auth/auth';
import { ApiResponse } from '../shared/models/util/api-response'
import { LocalStorageService } from '../core/services/local-storage.service';
import { SocketService } from '../home/shared-home/services/socket/socket.service';

import { ErrorUrlTab } from '../shared/enums/error-tab.enum';
import { RoleConstants } from '../core/constants/role.constant';
import { TeamsUrlTab } from '../shared/enums/teams-tab.enum';
import { SharedService } from '../shared/shared.service';
import { IErrorResponse } from '../shared/models/error/error.interface';
@Injectable()
export class AuthService {
  public isFirstLogin: boolean;

  private _onLogin = new Subject<boolean>();
  private _onLogout = new Subject<boolean>();

  constructor(
    private http: CustomHttpService,
    private router: Router,
    private cacheService: CacheService,
    private sharedService: SharedService,
    private _localStorageService: LocalStorageService,
    private socketService: SocketService,
    private _rightService: RightService
  ) { }

  public getUserData(): IUser {
    return {
      name: {
        first: this._localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.FIRST_NAME) || '',
        last: this._localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.LAST_NAME) || '',
      },
      meta: {
        profilePic: this._localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.META_DATA) || '',
      },
      _id: this._localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID)
    } as IUser;
  }

  public loginUserWithJira({ code, state }): Observable<any> {
    return this.http.post('/auth/jira-login', { code, state });
  }

  private loginCommandCenterUser(user: IUserLogin): Observable<ApiResponse<IAuth>> {
    return this.http.post('/auth/login', user).pipe(
      tap((response: ApiResponse<IAuth>) => {
        if (response.data.user.lastLogin) {
          this.isFirstLogin = false;
        } else {
          this.isFirstLogin = true;
        }
        this.saveAuthTokens(response.data);
        this.cacheService.initCacheService();
        this._onLogin.next();
      })
    );
  }

  public forgotPassword(
    params: IForgotOrResetPassword
  ): Observable<IForgotOrResetPasswordData> {
    return this.http.post<IForgotOrResetPasswordData>(
      '/auth/forgot-password',
      params
    );
  }

  public resetPassword(
    params: IResetPasswordParam
  ): Observable<IForgotOrResetPasswordData> {
    return this.http.post<IForgotOrResetPasswordData>(
      '/auth/reset-password',
      params
    );
  }

private setAdminPermission() : void
{
    this._rightService.getAdminRights().subscribe(
     (permission:number)=>{
      localStorage.setItem(LocalStorageConstants.ADMIN_PERMISSION, permission? permission.toString() : "0");
   },
   (error:any)=>{
    localStorage.setItem(LocalStorageConstants.ADMIN_PERMISSION,  "0");
   })
}

  private saveAuthTokens(data: IAuth): void {
    localStorage.setItem(LocalStorageConstants.USER_ID, data.user._id);
    localStorage.setItem(LocalStorageConstants.TOKEN, data.access_token);
    localStorage.setItem(LocalStorageConstants.ROLE, data.user.role.name);
    localStorage.setItem(LocalStorageConstants.EMAIL, data.user.email);
    localStorage.setItem(
      LocalStorageConstants.FIRST_NAME,
      data.user.name.first
    );
    localStorage.setItem(LocalStorageConstants.LAST_NAME, data.user.name.last);
    localStorage.setItem(LocalStorageConstants.IS_JIRA_LOGGEDIN, data[LocalStorageConstants.IS_JIRA_LOGGEDIN]);
    localStorage.setItem(LocalStorageConstants.NEW_NOTIFICATION_COUNT, data.user.newNotificationCount ? data.user.newNotificationCount.toString() : "0");
    localStorage.setItem(LocalStorageConstants.PERMISSION, data.permission ? data.permission.toString() : "0");
    this.setAdminPermission();


    if (data.user.meta && data.user.meta.profilePic) {
      localStorage.setItem(
        LocalStorageConstants.META_DATA,
        data.user.meta.profilePic
      );
    }
  }

  public logoutUser(): Observable<string> {
    return this.http.post('/auth/logout').pipe(
      tap((response: string) => {
        localStorage.clear();
        this.isFirstLogin = true;
        this.socketService.disconnectSocket();
        this.router.navigate([RouteConstants.LOGIN]);
        this._onLogout.next();
      })
    );
  }

  public loggedIn(): boolean {
    return !!this.getToken();
  }

  public getToken(): string {
    return localStorage.getItem(LocalStorageConstants.TOKEN);
  }

  public updateLastLogin(id: string) {
    return this.http.put<any>(`/users/${id}`, {
      lastLogin: new Date(),
    });
  }

  public getIssue(issueId: string) {
    return this.http.get(`/jira`, { issueId });
  }

  public createIssues(jiraDetails: any) {
    return this.http.post(`/jira`, jiraDetails);
  }

  public changePassword(params: IChangePasswordParam): Observable<any> {
    return this.http.post<any>('/auth/change-password', params);
  }

  public onLogin(): Observable<any> {
    return this._onLogin.asObservable();
  }

  public onLogout(): Observable<any> {
    return this._onLogout.asObservable();
  }

  public loginUser(user: IUserLogin): Subscription {
    const subscription = this.loginCommandCenterUser(user).subscribe(
      (response) => {
        this.updateLastLoginForUser(response.data.user)
        if (this.isFirstLogin && response.data.user.role.name.toLowerCase() === RoleConstants.ADMIN) {
          this.router.navigate([RouteConstants.TEAM_MANAGE], {
            queryParams: {
              _tab: TeamsUrlTab.TEAMS,
            },
          });
        } else {
          this.redirectToDashborad();
        }
      },
      (error: IErrorResponse) => {
        this.sharedService.openErrorSnackBar(error);
      }
    );

    return subscription;
  }

  private redirectToDashborad() {
    this.router.navigate([RouteConstants.DASHBOARD], {
      queryParams: {
        _tab: ErrorUrlTab.NEW,
      },
    });
  }

  public updateLastLoginForUser(user: { _id: string }): void {
    this.updateLastLogin(user._id).subscribe((response) => {
      localStorage.setItem(
        LocalStorageConstants.LAST_LOGIN,
        response.data.lastLogin
      );
    });
  }
}
