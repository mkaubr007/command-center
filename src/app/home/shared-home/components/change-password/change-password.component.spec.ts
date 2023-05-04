import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { LocalStorageConstants } from '../../../../core/constants/local-storage.constants';
import { CustomHttpService } from '../../../../core/services/http.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { MaterialModule } from '../../../../material/material.module';
import { PasswordValidatorConstants } from '../../../../services/password-validator/password-validator.constants';
import { PasswordValidatorService } from '../../../../services/password-validator/password-validator.service';
import { WebSocketService } from '../../../../services/web-socket/web-socket.service';
import { ConfirmedValidator } from '../../../../shared/custom-validators/confirmed.validator';
import { ApiResponse } from '../../../../shared/models/util/api-response';
import { SharedService } from '../../../../shared/shared.service';
import { CacheService } from '../../../cache-service';
import { SocketService } from '../../services/socket/socket.service';
import Utils from '../../utils/utils';
import { ChangePasswordComponent } from "./change-password.component";


const initForm = () => {

    const formBuilder: FormBuilder = new FormBuilder();
    const formGroup = formBuilder.group(
        {
            current_password: [
                null,
                [Validators.required, Utils.emptySpaceValidator()],
            ],
            new_password: [
                null,
                [Validators.required, Utils.emptySpaceValidator()],
            ],
            confirm_password: [
                null,
                [Validators.required, Utils.emptySpaceValidator()],
            ],
        },
        {
            validator: ConfirmedValidator('new_password', 'confirm_password')
        },
    );
    return formGroup;
};

let throwError = true;

class AuthServiceMock {
    comparePassword(): Observable<ApiResponse<any>> {
        if(throwError) {
            return of(PasswordValidatorConstants.SUCCESS);
        } else {
            return of(PasswordValidatorConstants.FAILURE)
        }
    }
    changePassword(): Observable<any> {
        return of(PasswordValidatorConstants.SUCCESS);
    }
}

class SharedServiceMock {
    openErrorSnackBar() {}    
    openSuccessSnackBar() {}
}

class MockCacheService {}

class MockSocketService {}

class MockWebSocketService {}

describe('ChangePasswordComponent', () => {
    let component: ChangePasswordComponent;
    let fixture: ComponentFixture<ChangePasswordComponent>;
    let localStorage: LocalStorageService;

    const dialogMock = { close: (value = '') => { } };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChangePasswordComponent],
            imports: [
                ReactiveFormsModule,
                MatDialogModule,
                FormsModule,
                MaterialModule,
                MatSelectModule,
                NgSelectModule,
                CommonModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                HttpClientModule,
            ],
            providers: [
                LocalStorageService,
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: dialogMock },
                { provide: SharedService, useClass: SharedServiceMock },
                { provide: CacheService, useClass: MockCacheService },
                { provide: SocketService, useClass: MockSocketService },
                { provide: WebSocketService, useClass: MockWebSocketService },
                CustomHttpService,
                PasswordValidatorService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        localStorage = TestBed.get(LocalStorageService);
    
        localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, PasswordValidatorConstants.USER_ID);
    
        fixture = TestBed.createComponent(ChangePasswordComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
      });

    it('should init changePasswordForm', () => {
        component.ngOnInit();

        expect(component.changePasswordForm.value).toEqual(initForm().value);
    });

    it('should close pop up without changing password', () => {
        const closePopup = jest.spyOn(component['dialogRef'], 'close');

        component.closePopup(false);

        expect(closePopup).toHaveBeenCalled();        
    });

    it('should close pop up after changing password', ()=> {
        const verifyCurrentPasswordSpy = jest.spyOn<any, any>(component,"verifyCurrentPassword");
        localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, PasswordValidatorConstants.USER_ID);
        component["initChangePasswordForm"]();
        component.changePasswordForm.get('new_password').setValue(PasswordValidatorConstants.PASSWORD);
        component.changePasswordForm.get('confirm_password').setValue(PasswordValidatorConstants.PASSWORD);

        component.closePopup(true);

        expect(verifyCurrentPasswordSpy).toHaveBeenCalled();
    });

    it('should verify current password and open SuccessSnackBar', async() => {
        localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, PasswordValidatorConstants.USER_ID);
        component["initChangePasswordForm"]();
        component.changePasswordForm.get('new_password').setValue(PasswordValidatorConstants.PASSWORD);
        component.changePasswordForm.get('confirm_password').setValue(PasswordValidatorConstants.PASSWORD);

        const spy = jest
        .spyOn(component['_authService'], 'changePassword')
        .mockImplementation(() => of(PasswordValidatorConstants.SUCCESS));

        const openSuccessSnackBar = jest
        .spyOn(component['_sharedService'], 'openSuccessSnackBar')
        .mockImplementation(() => of(PasswordValidatorConstants.SUCCESS));

        await component["verifyCurrentPassword"]();
        expect(spy).toHaveBeenCalled();
        expect(openSuccessSnackBar).toHaveBeenCalledWith(PasswordValidatorConstants.SUCCESS);
    });

    it('should verify current password and open ErrorSnackBar', async() => {
        localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, PasswordValidatorConstants.USER_ID);
        component["initChangePasswordForm"]();
        component.changePasswordForm.get('new_password').setValue(PasswordValidatorConstants.PASSWORD);
        component.changePasswordForm.get('confirm_password').setValue(PasswordValidatorConstants.PASSWORD);

        const spy = jest
        .spyOn(component['_authService'], 'changePassword')
        .mockImplementation(() => of(PasswordValidatorConstants.FAILURE));
        
        const openErrorSnackBar = jest
        .spyOn(component['_sharedService'], 'openErrorSnackBar')
        .mockImplementation(() => of(PasswordValidatorConstants.FAILURE));

        throwError = false;
        await component["verifyCurrentPassword"]();
        expect(spy).toHaveBeenCalled();
        expect(openErrorSnackBar).toHaveBeenCalledWith(PasswordValidatorConstants.FAILURE);
    });
});