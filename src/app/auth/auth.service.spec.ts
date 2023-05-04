import { cloneDeep } from 'lodash';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { LocalStorageConstants } from '../core/constants/local-storage.constants';
import { CustomHttpService } from '../core/services/http.service';
import { LocalStorageService } from '../core/services/local-storage.service';
import { CacheService } from '../home/cache-service';
import { SocketService } from '../home/shared-home/services/socket/socket.service';
import { PasswordValidatorConstants } from '../services/password-validator/password-validator.constants';
import { WebSocketService } from '../services/web-socket/web-socket.service';
import { SharedService } from '../shared/shared.service';
import { AuthService } from "./auth.service";
import { AuthConstants } from './test.constants';

class CustomHttpServiceMock extends CustomHttpService {
    post(): Observable<any> {
        return of(PasswordValidatorConstants.SUCCESS);
    }
}

class CacheServiceMock {
  public initCacheService() {};
}

class MockSharedService {
    public openErrorSnackBar() {};
}

class MockSocketService{}

class MockWebSocketService {}

describe('AuthService', () => {
    let service: AuthService;
    let localStorage: LocalStorageService;
    let cacheService: CacheService;
    let http: CustomHttpService;
    let sharedService: SharedService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                RouterTestingModule
            ],
            providers: [
              AuthService,
              LocalStorageService,
              { provide: CustomHttpService , useClass: CustomHttpServiceMock },
              { provide: CacheService , useClass: CacheServiceMock },
              { provide: SharedService, useClass: MockSharedService },
              { provide: SocketService, useClass: MockSocketService },
              { provide: WebSocketService, useClass: MockWebSocketService }
            ]
        }).compileComponents();
        service = TestBed.get(AuthService);
        cacheService = TestBed.inject(CacheService);
        http = TestBed.inject(CustomHttpService);
        sharedService = TestBed.inject(SharedService);
        localStorage = TestBed.inject(LocalStorageService);
        localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.FIRST_NAME, AuthConstants.FIRST_NAME);
        localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.LAST_NAME, AuthConstants.LAST_NAME);
        localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.META_DATA, AuthConstants.PROFILE_PIC);
        localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, AuthConstants.USER_ID);
      });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change password', () => {
        const spy = jest.spyOn(http, "post").mockImplementation(() => of(PasswordValidatorConstants.SUCCESS));

        service.changePassword(PasswordValidatorConstants.PARAMS);

        expect(spy).toHaveBeenCalled();
    });

    it('should get user data stored in localStorage', () => {
        const userData = service.getUserData();

        expect(userData).toEqual(AuthConstants.USER_DATA);
    });

    it('should reset password', async () => {
        const spy = jest.spyOn(http, "post").mockImplementation(() => of(AuthConstants.RESET_PASSWORD_RESPONSE));
        const result = await service.resetPassword(AuthConstants.RESET_PASSWORD_PARAMS).toPromise();

        expect(spy).toHaveBeenCalled();
        expect(result).toEqual(AuthConstants.RESET_PASSWORD_RESPONSE);
    });

    it('should login command center user and navigate to dashboard', async () => {
        const spy = jest.spyOn(http, "post")
        .mockImplementationOnce(() => of(AuthConstants.NEW_USER_LOGIN_RESPONSE));
        const initCacheServiceSpy = jest.spyOn(cacheService,'initCacheService').mockImplementation();

        await service.loginUser(AuthConstants.USER_LOGIN_DETAILS)

        expect(spy).toHaveBeenCalled();
        expect(service.isFirstLogin).toBeTruthy();
        expect(localStorage.getItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID)).toBe(AuthConstants.AUTH_TOKEN_NEW_USER.user._id);
        expect(localStorage.getItemInLocalStorageWithoutJSON(LocalStorageConstants.TOKEN)).toBe(AuthConstants.AUTH_TOKEN_NEW_USER.access_token);
        expect(localStorage.getItemInLocalStorageWithoutJSON(LocalStorageConstants.ROLE)).toBe(AuthConstants.AUTH_TOKEN_NEW_USER.user.role.name);
        expect(localStorage.getItemInLocalStorageWithoutJSON(LocalStorageConstants.EMAIL)).toBe(AuthConstants.AUTH_TOKEN_NEW_USER.user.email);
        expect(localStorage.getItemInLocalStorageWithoutJSON(LocalStorageConstants.FIRST_NAME)).toBe(AuthConstants.AUTH_TOKEN_NEW_USER.user.name.first);
        expect(localStorage.getItemInLocalStorageWithoutJSON(LocalStorageConstants.LAST_NAME)).toBe(AuthConstants.AUTH_TOKEN_NEW_USER.user.name.last);
        expect(localStorage.getItemInLocalStorageWithoutJSON(LocalStorageConstants.NEW_NOTIFICATION_COUNT)).toBe("0");
        expect(initCacheServiceSpy).toHaveBeenCalled();
    });

    it('should login old command center user having profile pic', () => {
        jest.spyOn(http, "post")
            .mockImplementationOnce(() => of(cloneDeep(AuthConstants.OLD_USER_LOGIN_RESPONSE)));
        jest.spyOn(cacheService,'initCacheService').mockImplementation();

        service.loginUser(AuthConstants.USER_LOGIN_DETAILS);
        expect(localStorage.getItemInLocalStorageWithoutJSON(LocalStorageConstants.META_DATA)).toBe(AuthConstants.AUTH_TOKEN_OLD_USER.user.meta.profilePic);
    });

    it('should throw error while trying to log in', () => {
        const openErrorSnackBarSpy = jest.spyOn(sharedService, 'openErrorSnackBar').mockImplementation();
        const loginCommandCenterUserSpy = jest.spyOn(http,'post').mockImplementation(
            () => throwError(AuthConstants.LOGIN_ERROR_RESPONSE)
        );
        service.loginUser(AuthConstants.USER_LOGIN_DETAILS);
        expect(loginCommandCenterUserSpy).toHaveBeenCalled();
        expect(openErrorSnackBarSpy).toHaveBeenCalledWith(AuthConstants.LOGIN_ERROR_RESPONSE);
    });
});
