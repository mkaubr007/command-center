import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { LocalStorageConstants } from '../../../../core/constants/local-storage.constants';
import { CustomHttpService } from '../../../../core/services/http.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { MaterialModule } from '../../../../material/material.module';
import { IUser } from '../../../../shared/models/auth/auth';
import {
  IErrorDetailResponseData,
  IErrorDetailResponse,
  IErrorDetail,
} from '../../../../shared/models/error-detail/error-detail.interface';
import { IStatus } from '../../../../shared/models/status/status.interface';
import { StatusService } from '../../../../shared/services/status.service';
import { SharedService } from '../../../../shared/shared.service';
import { ErrorService } from '../../../dashboard/shared/components/errors-tab/error.service';
import { NewErrorsList } from '../../../dashboard/shared/components/errors-tab/shared/constants/errors-test.constants';
import { NotificationDetailConstants } from './notification-detail-test-constants';
import { cloneDeep } from 'lodash';
import { NotificationDetailComponent } from './notification-detail.component';

describe('NotificationDetailComponent', () => {
  let component: NotificationDetailComponent;
  let fixture: ComponentFixture<NotificationDetailComponent>;
  let localStorage: LocalStorageService;

  class AuthServiceMock {
    getUserData(): IUser {
      return NewErrorsList.USER as IUser;
    }
  }

  class ErrorServiceMock {
    getErrors(): Observable<IErrorDetailResponseData> {
      return of(NewErrorsList.ERROR_DETAIL_RESPONSE);
    }

    updateErrorDetail(): Observable<IErrorDetailResponse> {
      return of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE);
    }

    getErrorDetail(id: string): Observable<IErrorDetail> {
      return of(NotificationDetailConstants.ERROR_DATA as any);
    }
  }

  class StatusServiceMock {
    getStatuses(): Observable<IStatus[]> {
      return of(NewErrorsList.GET_STATUS_SUCCESS_RESPONSE.data);
    }
  }

  class SharedServiceMock {
    openErrorSnackBar() {}
    openSuccessSnackBar() {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationDetailComponent],
      imports: [
        MaterialModule,
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgSelectModule,
      ],
      providers: [
        LocalStorageService,
        { provide: ErrorService, useClass: ErrorServiceMock },
        { provide: StatusService, useClass: StatusServiceMock },
        { provide: SharedService, useClass: SharedServiceMock },
        { provide: AuthService, useClass: AuthServiceMock },
        CustomHttpService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideTemplate(NotificationDetailComponent, '<div></div>')
      .compileComponents();

    localStorage = TestBed.inject(LocalStorageService);
    localStorage.setItemInLocalStorageWithoutJSON(
      LocalStorageConstants.USER_ID,
      NewErrorsList.LOCAL_STORAGE_CONSTANTS.user_id
    );
    localStorage.setItemInLocalStorageWithoutJSON(
      LocalStorageConstants.ROLE,
      NewErrorsList.LOCAL_STORAGE_CONSTANTS.role
    );

    fixture = TestBed.createComponent(NotificationDetailComponent);
    component = fixture.componentInstance;
    component.currentNotification = cloneDeep(
      NotificationDetailConstants.CURRENT_NOTIFICATION as any
    );
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch list of statuses successfully', async () => {
    const spy = jest
      .spyOn(component['_statusService'], 'getStatuses')
      .mockImplementation(() =>
        of(NewErrorsList.GET_STATUS_SUCCESS_RESPONSE.data)
      );

    await component.getStatuses();

    expect(spy).toHaveBeenCalledWith(NewErrorsList.GET_STATUS_PARAMS);
  });

  it('should set error detail from service', () => {
    const spy = jest.spyOn(component['errorService'], 'getErrorDetail');

    component.getErrorDetailFromService();

    expect(spy).toHaveBeenCalledWith(
      NotificationDetailConstants.CURRENT_NOTIFICATION.errorId
    );
    expect(component.errorDetail).toEqual(
      NotificationDetailConstants.ERROR_DATA
    );
  });

  it('should handle the errors', () => {
    const openSnackBarSpy = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation();

    const error = {
      error: 'Undefined Error',
      message: 'Value not found',
      statusCode: 400,
    };

    component.handleError(error);

    expect(openSnackBarSpy).toHaveBeenCalledWith(error);
  });

  it('should handle the success', () => {
    const openSnackBarSpy = jest
      .spyOn(component['_sharedService'], 'openSuccessSnackBar')
      .mockImplementation();

    const success = {
      data: 'Success',
      message: 'Value found',
    };

    component.handleSuccess(success);

    expect(openSnackBarSpy).toHaveBeenCalledWith(success);
  });

  it('should show notification list', () => {
    const emitSpy = jest.spyOn(component.goBack, 'emit').mockImplementation();
    component.showNotificationList();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should toggle the fullDisplay property of error', () => {
    component.toggleDesc = false;

    component.toggleDescending();
    expect(component.toggleDesc).toEqual(true);
  });

  it('should update the particular assignee successfully', async () => {
    const getUserDataSpy = jest.spyOn(component['_authService'], 'getUserData');
    const spy = jest.spyOn(component['errorService'], 'updateErrorDetail');

    const openSuccessSnackBar = jest
      .spyOn(component, 'handleSuccess')
      .mockImplementation(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE));

    await component.onAssigneeChange(
      NotificationDetailConstants.ERROR_DATA.assignedTo as any,
      NotificationDetailConstants.ERROR_DATA._id
    );

    expect(getUserDataSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(openSuccessSnackBar).toHaveBeenCalledWith(
      NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE
    );
  });

  it('should throw error while updating the particular assignee', async () => {
    const getUserDataSpy = jest.spyOn(component['_authService'], 'getUserData');

    const spy = jest
      .spyOn(component['errorService'], 'updateErrorDetail')
      .mockImplementation(() =>
        throwError(NewErrorsList.ERROR_DETAIL_ERROR_RESPONSE)
      );

    const openErrorSnackBar = jest
      .spyOn(component, 'handleError')
      .mockImplementation(() => of(NewErrorsList.ERROR_DETAIL_UPDATE_RESPONSE));

    await component.onAssigneeChange(
      NotificationDetailConstants.ERROR_DATA.assignedTo as any,
      NotificationDetailConstants.ERROR_DATA._id
    );

    expect(getUserDataSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(openErrorSnackBar).toHaveBeenCalledWith(
      NewErrorsList.ERROR_DETAIL_ERROR_RESPONSE
    );
  });

  it('should update the status successfully', async () => {

    const updateErrorDetailSpy = jest.spyOn(
      component['errorService'],
      'updateErrorDetail'
    );

    const openSuccessSnackBar = jest
      .spyOn(component, 'handleSuccess')
      .mockImplementation();

    await component.onStatusChange(
      NotificationDetailConstants.ERROR_DATA.status,
      NotificationDetailConstants.ERROR_DATA._id
    );

    expect(component.errorDetail.status).toEqual(NotificationDetailConstants.ERROR_DATA.status);

    expect(updateErrorDetailSpy).toHaveBeenCalled();
    expect(openSuccessSnackBar).toHaveBeenCalled();
  });

  it('should throw error while updating the status assignee because there is no assignee', async () => {
    const error = cloneDeep(NotificationDetailConstants.ERROR_DATA);
    error.assignedTo = undefined;

    const spy = jest
    .spyOn(component['errorService'], 'updateErrorDetail')
    .mockImplementation(() =>
      throwError(NewErrorsList.ERROR_DETAIL_ERROR_RESPONSE)
    );

    const openErrorSnackBar = jest
      .spyOn(component, 'handleError')
      .mockImplementation();

    await component.onStatusChange(error.status, error._id);

    expect(spy).toHaveBeenCalled();
    expect(openErrorSnackBar).toHaveBeenCalledWith(
      NewErrorsList.ERROR_DETAIL_ERROR_RESPONSE
    );
  });

  it('Should set old error status', () => {
    component.errorDetail = cloneDeep(NotificationDetailConstants.ERROR_DATA);
    component.getOldErrorStatus();
    expect(component.oldErrorStatus).toEqual(NotificationDetailConstants.ERROR_DATA.status);
  })
});
