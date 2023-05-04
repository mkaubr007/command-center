import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormArray, FormBuilder, FormControl, ReactiveFormsModule,Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { cloneDeep } from 'lodash';
import { Observable, of, throwError } from 'rxjs';
import { LocalStorageConstants } from '../../../../../core/constants/local-storage.constants';
import { CustomHttpService } from '../../../../../core/services/http.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { MaterialModule } from '../../../../../material/material.module';
import { IClientResponse, IService, IServiceResponse } from '../../../../../shared/models/client-service-rep/client-service-rep';
import { SharedService } from '../../../../../shared/shared.service';
import { ErrorService } from '../../../../dashboard/shared/components/errors-tab/error.service';
import { SharedHomeModule } from '../../../../shared-home/shared-home.module';
import { TeamService } from '../../../team.service';
import { AddAndUpdateEnvironmentServiceComponent } from './add-and-update-environment-service.component';
import { AddAndUpdateEnvTest } from './add-and-update-environment-test.constant';
import { AuthService } from '../../../../../auth/auth.service';
import { MockAuthService } from '../../../../../auth/mock-auth.service';
import { SocketService } from '../../../../shared-home/services/socket/socket.service';
import { WebSocketService } from '../../../../../services/web-socket/web-socket.service';
import { RoleConstants } from '../../../../../core/constants/role.constant';
import { MockErrorService } from '../../../../dashboard/shared/components/errors-tab/mock-error.service';
import { ManageClient } from '../manage-clients/test.constants';
import { MessageConstant } from '../../../../../core/constants/message.constant';

class MockTeamService {
  getServices(): Observable<IService[]> {
    return of(AddAndUpdateEnvTest.servicesList);
  }

  createService(): Observable<IServiceResponse> {
    return of(AddAndUpdateEnvTest.serviceResponse);
  }

  addEnvironment(): Observable<IClientResponse> {
    return of(AddAndUpdateEnvTest.EnvResponse);
  }

  updateClient(): Observable<IClientResponse> {
    return of(AddAndUpdateEnvTest.EnvResponse);
  }
}

class MockSharedService  {
  openSuccessSnackBar() {}
  openErrorSnackBar() {}
}

class MockWebSocketService  {}

class MockSocketService  {
  emitActivatedClient() {}
  emitDeactivatedClient() {}
}

class MockCustomHttpService  {}

describe('AddAndUpdateEnvironmentServiceComponent', () => {
  let component: AddAndUpdateEnvironmentServiceComponent;
  let fixture: ComponentFixture<AddAndUpdateEnvironmentServiceComponent>;
  const formBuilder = new FormBuilder();
  let localStorage: LocalStorageService;

  const dialogMock = { close: (value = '') => { } };

  const initAddUpdateEnvForm = () => {
    return formBuilder.group({
      name: [null, [Validators.required]],
      isPrioritized: [false],
      status: [MessageConstant.ACTIVE],
      services: formBuilder.array([]),
    });
  };

  const serviceForm = () => {
    return formBuilder.group({
      name: [null, [Validators.required]],
      createdBy: [null],
      description: [null],
      type: [null],
      checkInTimeInterval: formBuilder.group({
        time: [null],
        unit: [null],
      })
    });
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddAndUpdateEnvironmentServiceComponent],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        CommonModule,
        BrowserAnimationsModule,
        SharedHomeModule,
        HttpClientModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: TeamService, useClass: MockTeamService },
        { provide: SharedService, useClass: MockSharedService  },
        { provide: CustomHttpService, useClass: MockCustomHttpService },
        LocalStorageService,
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SocketService, useClass: MockSocketService },
        { provide: WebSocketService, useClass: MockWebSocketService },
        {provide: AuthService, useclass: MockAuthService}
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AddAndUpdateEnvironmentServiceComponent);
    component = fixture.debugElement.componentInstance;
    localStorage = TestBed.get(LocalStorageService);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.ROLE, RoleConstants.CLIENT_SERVICE_REPRESENTATIVE);
    component.client = cloneDeep(ManageClient.CLIENT);
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.serviceForm = serviceForm();
    const data: any = {
      client: cloneDeep(AddAndUpdateEnvTest.testClient),
      services: cloneDeep(AddAndUpdateEnvTest.servicesList)
    };
    component.data = data;
    // fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init page', () => {
    const formGroup = initAddUpdateEnvForm();
    const serviceFormGroup = serviceForm();
    component.ngOnInit();

    expect(component.addUpdateEnvForm.value).toEqual(formGroup.value);
    expect(component.serviceForm.value).toEqual(serviceFormGroup.value);
    expect(component.services).toEqual(AddAndUpdateEnvTest.servicesList);
  });

  it('should close popup on false value', () => {
    const closePopup = jest.spyOn(component['dialogRef'], 'close');
    component['newServiceSelcted'] = false;
    component.onCloseEnvPopup(false);
    expect(closePopup).toHaveBeenCalled();
  });

  it('should close popup on true value and No new service selected', () => {
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.addUpdateEnvForm.patchValue(AddAndUpdateEnvTest.newEnvironmentData);
    component['newServiceSelcted'] = false;
    const addService = jest.spyOn(component['_teamService'], 'addEnvironment');
    const closePopup = jest.spyOn(component['dialogRef'], 'close');

    component.onCloseEnvPopup(true);
    expect(component['newServiceSelcted']).toBeFalsy();
    expect(addService).toHaveBeenCalledWith(component.addUpdateEnvForm.value, ManageClient.CLIENT._id);
    expect(component.isLoading).toBeFalsy();
    expect(closePopup).toHaveBeenCalled();
  });

  it('should check for add environment error', () => {
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.addUpdateEnvForm.patchValue(AddAndUpdateEnvTest.newEnvironmentData);
    component['newServiceSelcted'] = false;
    const addService = jest.spyOn(component['_teamService'], 'addEnvironment')
      .mockImplementation(() => throwError(AddAndUpdateEnvTest.ERROR_RESPONSE));
    const openErrorSnackBar = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation();

    component.onCloseEnvPopup(true);
    expect(component['newServiceSelcted']).toBeFalsy();
    expect(addService).toHaveBeenCalledWith(component.addUpdateEnvForm.value, ManageClient.CLIENT._id);
    expect(component.isLoading).toBeFalsy();
    expect(openErrorSnackBar).toHaveBeenCalledWith(AddAndUpdateEnvTest.ERROR_RESPONSE);
  });

  it('should change showTab value', () => {
    component.showTabs = false;
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.addUpdateEnvForm.patchValue(AddAndUpdateEnvTest.newEnvironmentData);
    component.selectedTab = 0;
    component.isTabVisible();
    expect(component.showTabs).toBeTruthy();
    expect(component.selectedTab).toEqual(1);
  });

  it('should get selected tab and set visibility', () => {
    component.getSelectedTab(1);

    expect(component.showTabs).toBeTruthy();
    expect(component.selectedTab).toEqual(1);
  });

  it('should get selected tab and set visibility', () => {
    component.getSelectedTab(0);

    expect(component.showTabs).toBeFalsy();
    expect(component.selectedTab).toEqual(0);
  });

  it('should clear selcted service', () => {
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.onServiceSelection([]);
    expect(component.addUpdateEnvForm.value.services).toEqual([]);
  });

  it('should add selected services', () => {
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.onServiceSelection(AddAndUpdateEnvTest.servicesList);
    expect(component.addUpdateEnvForm.value.services[0].name).toEqual(AddAndUpdateEnvTest.servicesList[0].name);
    expect(component['newServiceSelcted']).toBeFalsy();
  });

  it('should add new selected services', () => {
    const obj: IService[] = [{ name: 'Test' }];
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.onServiceSelection(obj);
    expect(component.addUpdateEnvForm.value.services[0].name).toEqual('Test');
    expect(component.addUpdateEnvForm.value.services[0].id).toEqual('');
    expect(component['newServiceSelcted']).toBeTruthy();
  });

  it('should call onCloseServicePopup with false', () => {
    const closePopup = jest.spyOn(component['dialogRef'], 'close');
    component.onCloseServicePopup(false);
    expect(closePopup).toHaveBeenCalled();
  });

  it('should call onCloseServicePopup with true and no environment selcted', () => {
    component.serviceForm = serviceForm();
    component.serviceForm.patchValue(AddAndUpdateEnvTest.newServiceData);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, '5e9e9022abfc01673460a39c');
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.FIRST_NAME, 'Vikash');
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.LAST_NAME, 'Gaurav');
    const createService = jest.spyOn(component['_teamService'], 'createService');
    const closePopup = jest.spyOn(component['dialogRef'], 'close');
    const openSuccessSnackBar = jest
      .spyOn(component['_sharedService'], 'openSuccessSnackBar')
      .mockImplementation(() => of(AddAndUpdateEnvTest.serviceResponse));

    component.onCloseServicePopup(true);

    expect(createService).toHaveBeenCalled();
    expect(component.isLoading).toBeFalsy();
    expect(closePopup).toHaveBeenCalled();
    expect(openSuccessSnackBar).toHaveBeenCalledWith(AddAndUpdateEnvTest.serviceResponse);
  });

  it('shouild check createService error response', () => {
    component.serviceForm = serviceForm();
    component.serviceForm.patchValue(AddAndUpdateEnvTest.newServiceData);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, '5e9e9022abfc01673460a39c');
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.FIRST_NAME, 'Vikash');
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.LAST_NAME, 'Gaurav');
    const createService = jest.spyOn(component['_teamService'], 'createService')
      .mockImplementation(() => throwError(AddAndUpdateEnvTest.ERROR_RESPONSE));
    const openErrorSnackBar = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation();

    component.onCloseServicePopup(true);

    expect(createService).toHaveBeenCalled();
    expect(component.isLoading).toBeFalsy();
    expect(openErrorSnackBar).toHaveBeenCalledWith(AddAndUpdateEnvTest.ERROR_RESPONSE);
  });

  it('should call onCloseServicePopup with true and environment selcted', () => {
    component['selectedEnvironment'] = [0];
    component.serviceForm.patchValue(AddAndUpdateEnvTest.newServiceData);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, '5e9e9022abfc01673460a39c');
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.FIRST_NAME, 'Vikash');
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.LAST_NAME, 'Gaurav');
    const createService = jest.spyOn(component['_teamService'], 'createService');
    const updateClient = jest.spyOn(component['_teamService'], 'updateClient');
    const closePopup = jest.spyOn(component['dialogRef'], 'close');
    const openSuccessSnackBar = jest
      .spyOn(component['_sharedService'], 'openSuccessSnackBar')
      .mockImplementation(() => of(AddAndUpdateEnvTest.EnvResponse));

    const testData = cloneDeep(ManageClient.CLIENT);
    testData.environments[0].services.push(AddAndUpdateEnvTest.NEW_SERVICE);

    component.addUpdateEnvForm.reset();

    component.onCloseServicePopup(true);

    expect(createService).toHaveBeenCalled();
    expect(updateClient).toHaveBeenCalledWith(ManageClient.CLIENT._id, testData);
    expect(component.isLoading).toBeFalsy();
    expect(closePopup).toHaveBeenCalled();
    expect(openSuccessSnackBar).toHaveBeenCalledWith(AddAndUpdateEnvTest.EnvResponse);
  });

  it('should check for update client error', () => {
    component['selectedEnvironment'] = [0];
    component.addUpdateEnvForm.reset();
    component.serviceForm.patchValue(AddAndUpdateEnvTest.newServiceData);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, '5e9e9022abfc01673460a39c');
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.FIRST_NAME, 'Vikash');
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.LAST_NAME, 'Gaurav');
    const createService = jest.spyOn(component['_teamService'], 'createService');
    const updateClient = jest.spyOn(component['_teamService'], 'updateClient')
      .mockImplementation(() => throwError(AddAndUpdateEnvTest.ERROR_RESPONSE));
    const openErrorSnackBar = jest
      .spyOn(component['_sharedService'], 'openErrorSnackBar')
      .mockImplementation();

    const testData = cloneDeep(ManageClient.CLIENT);
    testData.environments[0].services.push(AddAndUpdateEnvTest.NEW_SERVICE);

    component.onCloseServicePopup(true);

    expect(createService).toHaveBeenCalled();
    expect(updateClient).toHaveBeenCalledWith(ManageClient.CLIENT._id, testData);
    expect(component.isLoading).toBeFalsy();
    expect(openErrorSnackBar).toHaveBeenCalledWith(AddAndUpdateEnvTest.ERROR_RESPONSE);
  });

  it('should check for existing environment name on input', () => {
    component.onEnvironmentInput('envtest1');
    expect(component.isEnvExist).toBeTruthy();
  });

  it('should check for not existing environment name on input', () => {
    const event = 'Development';
    component.client.environments.push({
      name: 'Test Dev',
      status: 'active',
      isPrioritized: false,
      services: [],
    });
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.onEnvironmentInput(event);
    expect(component.isEnvExist).toBeFalsy();
    expect(component.client.environments.length).toEqual(2);
  });

  it('should check for existing environment on input', () => {
    component.onEnvironmentInput('Dev');
    expect(component.isEnvExist).toBeFalsy();
    expect(component.client.environments[1].name).toEqual('Dev');
  });

  it('should push new env object', () => {
    const event = 'Dev';
    component.client = cloneDeep(ManageClient.CLIENT);
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.client.environments.push({
      name: 'Dev',
      status: 'active',
      isPrioritized: false,
      services: [],
    });
    component.onEnvironmentInput(event);
    expect(component.isEnvExist).toBeFalsy();
    expect(component.client.environments[1].name).toEqual(event);
  });

  it('should splice new env object', () => {
    const event = '';
    component.client = cloneDeep(ManageClient.CLIENT);
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.client.environments.push({
      name: 'Test Dev',
      status: 'active',
      isPrioritized: false,
      services: [],
    });
    component.onEnvironmentInput(event);
    expect(component.isEnvExist).toBeFalsy();
    expect(component.client.environments.length).toEqual(1);
  });

  it('should check for existing service name on input and splice data from form array', () => {
    component.services = cloneDeep(AddAndUpdateEnvTest.servicesList);
    const event = 'OCR service';
    component.services.push({
      name: 'Test Serivice'
    });
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    (component.addUpdateEnvForm.get('services') as FormArray).push(
      new FormControl({
        id: '',
        name: 'Test Serivice',
      }));
    component['newServiceSelcted'] = true;
    component.onServiceInput(event);
    expect(component.isServiceExist).toBeTruthy();
    expect(component.services.length).toEqual(2);
    expect(component.addUpdateEnvForm.value.services.length).toEqual(0);
    expect(component['newServiceSelcted']).toBeFalsy();
  });

  it('should push new serivce name', () => {
    component.services = cloneDeep(AddAndUpdateEnvTest.servicesList);
    const event = 'Test Service';
    component.onServiceInput(event);
    expect(component.isServiceExist).toBeFalsy();
    expect(component.services[2].name).toEqual(event);
  });

  it('should update new serive name on existing index', () => {
    component.services = cloneDeep(AddAndUpdateEnvTest.servicesList);
    const event = 'Test Service 1';
    component.services.push({
      name: 'Test Service'
    });
    component.onServiceInput(event);
    expect(component.isServiceExist).toBeFalsy();
    expect(component.services[2].name).toEqual(event);
  });

  it('should splice new serivce on empty service name', () => {
    component.services = cloneDeep(AddAndUpdateEnvTest.servicesList);
    const event = '';
    component.services.push({
      name: 'Test Service 1'
    });
    component.onServiceInput(event);
    expect(component.isServiceExist).toBeFalsy();
    expect(component.services.length).toEqual(2);
  });

  it('should push selcted environemnt', () => {
    component.onSelectEnvironment(true, 0);
    expect(component['selectedEnvironment'].length).toEqual(1);
  });

  it('should push selcted environemnt', () => {
    component['selectedEnvironment'] = [0, 1];
    component.onSelectEnvironment(false, 1);
    expect(component['selectedEnvironment'].length).toEqual(1);
  });

  it('should close popup on true value and with new service selected', () => {
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.serviceForm = serviceForm();
    component.addUpdateEnvForm.patchValue(AddAndUpdateEnvTest.newEnvironmentData);
    component.serviceForm.patchValue(AddAndUpdateEnvTest.newServiceData);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.USER_ID, '5e9e9022abfc01673460a39c');
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.FIRST_NAME, 'Vikash');
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.LAST_NAME, 'Gaurav');

    const createService = jest.spyOn(component['_teamService'], 'createService');

    component['newServiceSelcted'] = true;

    component.onCloseEnvPopup(true);
    expect(component['newServiceSelcted']).toBeTruthy();
    expect(createService).toHaveBeenCalled();
  });

  it('should set time unit as required', () => {
    component.isUnitRequired = false;
    component.onCheckInTimeInput('12');
    expect(component.isUnitRequired).toBeTruthy();
  });

  it('should set time unit as not required', () => {
    component.isUnitRequired = true;
    component.onCheckInTimeInput('');
    expect(component.isUnitRequired).toBeFalsy();
  });


  it('should add service via socket', () =>{
    const emitActivatedClientSpy = jest.spyOn(component['_socketService'],"emitActivatedClient").mockImplementation();

    component['addServiceViaSocket']([ManageClient.SERVICE_FOR_SOCKET.name]);

    expect(emitActivatedClientSpy).toHaveBeenCalledWith(ManageClient.OBJECT_FOR_SOCKET);
  });

  it('should remove service via socket', () =>{
    const emitDeactivatedClientSpy = jest.spyOn(component['_socketService'],"emitDeactivatedClient").mockImplementation();

    component['removeServiceViaSocket']([ManageClient.SERVICE_FOR_SOCKET.name]);

    expect(emitDeactivatedClientSpy).toHaveBeenCalledWith(ManageClient.OBJECT_FOR_SOCKET);
  });

  it('should add service for home dropdown', () =>{
    component['previouslySelectedServices'] = [ManageClient.SERVICES.map(service => service.name)[2]];
    component.envToUpdate = cloneDeep(ManageClient.CLIENT.environments[0]);

    const addServiceViaSocketSpy = jest.spyOn<any, any>(component,"addServiceViaSocket").mockImplementation();

    component['addOrRemoveService']();

    expect(addServiceViaSocketSpy).toHaveBeenCalledWith(ManageClient.SERVICE_TO_ADD);
  });

  it('should remove service for home dropdown', () =>{
    component['previouslySelectedServices'] = ManageClient.SERVICES.map(service => service.name);
    component.envToUpdate = cloneDeep(ManageClient.CLIENT.environments[0]);

    const removeServiceViaSocketSpy = jest.spyOn<any, any>(component,"removeServiceViaSocket").mockImplementation();

    component['addOrRemoveService']();

    expect(removeServiceViaSocketSpy).toHaveBeenCalledWith(ManageClient.SERVICE_TO_REMOVE);
  });

  it("should update client's environment before updating client", () =>{
    component.addUpdateEnvForm = initAddUpdateEnvForm();
    component.client = cloneDeep(ManageClient.CLIENT);
    component.envToUpdate = component.client.environments[0];

    component.addUpdateEnvForm.get('name').setValue(ManageClient.CLIENT.name);
    component.envToUpdate._id = cloneDeep(ManageClient.CLIENT.environments[0]._id);

    component['updateEnvironment']();

    let updatedClient = cloneDeep(ManageClient.CLIENT);
    updatedClient.environments = cloneDeep(ManageClient.UPDATED_ENVIRONMENTS);

    expect(component.client).toEqual(updatedClient);
  });

  it('should set selectedServices for the service dropdown on updating environment', () => {
    component.envToUpdate = ManageClient.CLIENT.environments[0];

    component.services = ManageClient.SERVICES;

    const onServiceSelectionSpy = jest.spyOn<any, any>(component, 'onServiceSelection').mockImplementation();

    component['getSelectedServices']();

    expect(onServiceSelectionSpy).toHaveBeenCalledWith([ManageClient.SERVICES[0]]);
    expect(component['previouslySelectedServices']).toEqual([ManageClient.SERVICE_TO_REMOVE[0]]);
  });

});
