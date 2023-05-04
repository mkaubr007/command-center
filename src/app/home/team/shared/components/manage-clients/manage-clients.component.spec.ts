import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BlockUIModule } from 'ng-block-ui';
import { TooltipModule } from 'ng2-tooltip-directive';
import { Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { LocalStorageConstants } from '../../../../../core/constants/local-storage.constants';
import { MessageConstant } from '../../../../../core/constants/message.constant';
import { CustomHttpService } from '../../../../../core/services/http.service';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';
import { SharedHomeModule } from '../../../../../home/shared-home/shared-home.module';
import { MaterialModule } from '../../../../../material/material.module';
import { WebSocketService } from '../../../../../services/web-socket/web-socket.service';
import { IClientEnvResponse, IClientResponse, IClientResponseData, IService } from '../../../../../shared/models/client-service-rep/client-service-rep';
import { ApiResponse } from '../../../../../shared/models/util/api-response';
import { SetWalkthroughVisible } from '../../../../../shared/models/walkthrough/walkthrough.model';
import { SharedService } from '../../../../../shared/shared.service';
import { DeleteComponent } from '../../../../shared-home/components/delete/delete.component';
import { SocketService } from '../../../../shared-home/services/socket/socket.service';
import { TeamService } from '../../../team.service';
import { AddAndUpdateClientComponent } from '../add-and-update-client/add-and-update-client.component';
import { AddAndUpdateEnvironmentServiceComponent } from '../add-and-update-environment-service/add-and-update-environment-service.component';
import { TeamHeaderComponent } from '../team-header/team-header.component';
import { ManageClientsComponent } from './manage-clients.component';
import { ManageClient } from './test.constants';
import { cloneDeep } from 'lodash';
import { SortBy } from '../../../../../shared/enums/sorting.enum';
import { TeamMemberStatus } from '../../../../../shared/enums/teams-tab.enum';
import { MatExpansionPanel } from '@angular/material/expansion';


describe('ManageClientsComponent', () => {
  let component: ManageClientsComponent;
  let fixture: ComponentFixture<ManageClientsComponent>;
  let localStorage: LocalStorageService;
  let teamService: TeamService;
  let socketService: SocketService;
  let sharedService: SharedService;
  class MatDialogMock {
    open() {
      return {
        afterClosed: () => of({ data: 'returned data' }),
      };
    }
  }

  class TeamServiceMock {
    inputValue = new Subject<any>();

    getClients(): Observable<IClientResponseData> {
      return of(cloneDeep( ManageClient.CLIENT_DATA_RESPONSE));
    }

    updateEnvironment(): Observable<ApiResponse<IClientEnvResponse>> {
      return of(ManageClient.UPDATE_ENV_SUCCESS_RESPONSE);
    }

    updateClient(): Observable<IClientResponse> {
      return of(ManageClient.DEACTIVATED_CLIENT_RESPONSE);
    }

    getServices(): Observable<IService[]> {
      return of(ManageClient.SERVICES);
    }

    getInputValue(): Observable<any> {
      return this.inputValue.asObservable();
    }
  }

  class MockWebSocketService {}

  class MockSocketService {
    emitDeactivatedClient() {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageClientsComponent, TeamHeaderComponent],
      imports: [
        SharedHomeModule,
        CommonModule,
        HttpClientModule,
        TooltipModule,
        RouterTestingModule,
        FormsModule,
        BlockUIModule.forRoot(),
        MaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: TeamService, useClass: TeamServiceMock },
        { provide: MatDialog, useClass: MatDialogMock },
        SharedService,
        CustomHttpService,
        LocalStorageService,
        { provide: SocketService, useClass: MockSocketService },
        { provide: WebSocketService, useClass: MockWebSocketService }
      ],
    })
      .overrideComponent(ManageClientsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClientsComponent);
    component = fixture.debugElement.componentInstance;
    localStorage = TestBed.inject(LocalStorageService);
    teamService = TestBed.inject(TeamService);
    socketService = TestBed.inject(SocketService);
    sharedService = TestBed.inject(SharedService);
    localStorage.setItemInLocalStorageWithoutJSON(LocalStorageConstants.ASSIGNEES, ManageClient.ASSIGNEES);
  });

  it('should init component', () => {
    expect(component).toBeTruthy();
  });

  it('should get client list and set subscription and services', () => {
    const getClientsListSpy = jest.spyOn(component, 'getClientsList').mockImplementation();
    const onSearchClientSubscriptionSpy = jest.spyOn<any, any>(component, 'onSearchClientSubscription').mockImplementation();
    const setServicesSpy = jest.spyOn<any, any>(component, 'setServices').mockImplementation();

    component.ngOnInit();

    expect(getClientsListSpy).toHaveBeenCalled();
    expect(onSearchClientSubscriptionSpy).toHaveBeenCalled();
    expect(setServicesSpy).toHaveBeenCalled();
  });

  it('should open deactivate client popup', () => {
    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of(true) });

    const deactivateClientSpy = jest.spyOn<any, any>(component,'deactivateClient').mockImplementation();

    component.openDeactivateClientPopup(cloneDeep(ManageClient.CLIENT_DATA_RESPONSE.result[0]));

    expect(component._dialog.open).toHaveBeenCalledWith(
      DeleteComponent,
      ManageClient.DELETE_CLIENT_MSG_DATA
    );

    expect(deactivateClientSpy).toHaveBeenCalledWith(cloneDeep(ManageClient.CLIENT_DATA_RESPONSE.result[0]));

  });

  it('should not open deactivate client if popup is simply closed', () => {
    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of(false) });

    const deactivateClientSpy = jest.spyOn<any, any>(component,'deactivateClient').mockImplementation();

    component.openDeactivateClientPopup(cloneDeep(ManageClient.CLIENT_DATA_RESPONSE.result[0]));

    expect(deactivateClientSpy).toHaveBeenCalledTimes(0);
  });

  it('should deactivate client successfully', () => {
    const updateClientSpy = jest.spyOn(teamService, 'updateClient').mockImplementation(() => {
      return of(ManageClient.DEACTIVATED_CLIENT_RESPONSE);
    });
    const updateActiveClientEnvListingSpy = jest.spyOn<any, any>(component, 'updateActiveClientEnvListing').mockImplementation();
    const getClientsListSpy = jest.spyOn(component, 'getClientsList').mockImplementation();
    const openSuccessSnackBar = jest
    .spyOn(sharedService, 'openSuccessSnackBar')
    .mockImplementation(() => of(ManageClient.DEACTIVATED_CLIENT_RESPONSE));

    component['deactivateClient'](ManageClient.DEACTIVATE_CLIENT);

    expect(updateClientSpy).toHaveBeenCalledWith(ManageClient.DEACTIVATE_CLIENT._id, ManageClient.DEACTIVATE_CLIENT);
    expect(updateActiveClientEnvListingSpy).toHaveBeenCalledWith(ManageClient.DEACTIVATE_CLIENT, undefined, undefined);
    expect(getClientsListSpy).toHaveBeenCalled();
    expect(openSuccessSnackBar).toHaveBeenCalledWith(ManageClient.DEACTIVATED_CLIENT_RESPONSE);
  });

  it('should raise error when deactivating client', () => {
    const updateClientSpy = jest.spyOn(teamService, 'updateClient').mockImplementation(() => 
      throwError(ManageClient.CLIENT_ERROR_RESPONSE));
    
    const openErrorSnackBar = jest
      .spyOn(sharedService, 'openErrorSnackBar')
      .mockImplementation(() => of(ManageClient.CLIENT_ERROR_RESPONSE));
    
      component['deactivateClient'](ManageClient.DEACTIVATE_CLIENT);

      expect(updateClientSpy).toHaveBeenCalled();
      expect(openErrorSnackBar).toHaveBeenCalledWith(ManageClient.CLIENT_ERROR_RESPONSE);
  });

  it('should filter active environments', () => {
    const activeEnvs = component.filterActiveEnvironments(ManageClient.CLIENT.environments);

    expect(activeEnvs).toEqual([ManageClient.CLIENT.environments[0]]);
  });

  it('should set client search subscription', () => {
    const getClientsListSpy = jest.spyOn<any, any>(component, 'getClientsList').mockImplementation();
    component.ngOnInit();
    //the ngonint function calls the set subscription method which subscribes to the subject. Only after the subscription has been set
    //we call the next method to set value in the subject 
    teamService.inputValue.next("search");

    expect(component.isSearch).toBeTruthy();
    expect(component['searchText']).toBe("search");
    expect(getClientsListSpy).toHaveBeenCalled();
  });

  it('should open add client popup', () => {
    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValue({ afterClosed: () => of(true) }).mock
    
    const addClientPopupSpy = jest
      .spyOn(component, 'addClientPopup')
      .mockImplementation();

    component.openAddClientPopup();

    expect(addClientPopupSpy).toHaveBeenCalledWith(MessageConstant.ADD_NEW_CLIENT);
  });

  it('should add client', () => {
    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of(true) }).mockReturnValueOnce({ afterClosed: () => of(false) });
    jest
      .spyOn(teamService, 'getClients')
      .mockImplementation(() => of(cloneDeep(ManageClient.CLIENT_DATA_RESPONSE)));
    component.addClientPopup(MessageConstant.ADD_NEW_CLIENT);

    expect(component._dialog.open).toHaveBeenCalledWith(
      AddAndUpdateClientComponent,
      ManageClient.ADD_CLIENT_MSG_DATA
    );
  });

  it('should not get client list if add client popup is closed', () => {
    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of(false) });

    const getClientsListSpy = jest.spyOn(component, 'getClientsList').mockImplementation();

    component.addClientPopup(MessageConstant.ADD_NEW_CLIENT);
    expect(getClientsListSpy).toHaveBeenCalledTimes(0);
  });

  it('should open DeactivateServicePopup', () => {

    const selectedClient = ManageClient.CLIENT;
    const selectedEnv = selectedClient.environments[0]._id;
    const selectedService = selectedClient.environments[0].services[0];
    const removeServiceSpy = jest.spyOn(component, 'removeService').mockImplementation();

    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of(true) });
    
    component.openDeactivateServicePopup(selectedClient, selectedEnv, selectedService);

    expect(removeServiceSpy).toHaveBeenCalledWith(selectedClient, selectedEnv, selectedService);


  });

  it('should not remove service if DeactivateServicePopup is closed', () => {
    const selectedClient = ManageClient.CLIENT;
    const selectedEnv = selectedClient.environments[0]._id;
    const selectedService = selectedClient.environments[0].services[0];
    const removeServiceSpy = jest.spyOn(component, 'removeService').mockImplementation();

    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of(false) });

    component.openDeactivateServicePopup(selectedClient, selectedEnv, selectedService);

    expect(removeServiceSpy).toHaveBeenCalledTimes(0);
  });

  it('should fetch client list and set services after adding service or environment', () => {
    jest
      .spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValue({ afterClosed: () => of(true) });

    const setServicesSpy = jest.spyOn<any, any>(component, 'setServices').mockImplementation();
    const getClientsListSpy = jest.spyOn<any, any>(component, 'getClientsList').mockImplementation();

    component.openAddEnvironmentServicePopup(
      ManageClient.CLIENT_DATA_RESPONSE.result[0]
    );

    expect(setServicesSpy).toHaveBeenCalled();
    expect(getClientsListSpy).toHaveBeenCalled();
  });

  it('should open add env service popup when both environments and services are present', () => {
    jest
      .spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValue({ afterClosed: () => of(false) });
    jest.spyOn(component.walkthroughData, 'emit');
    component['services'] = [];
    component.totalEnv = 0;
    component.clientList = cloneDeep(ManageClient.CLIENT_RESPONSE.data.result);
    component.openAddEnvironmentServicePopup(
      ManageClient.CLIENT_DATA_RESPONSE.result[0]
    );

    expect(component._dialog.open).toHaveBeenCalledWith(
      AddAndUpdateEnvironmentServiceComponent,
      ManageClient.ADD_ENV_SERVICE_MSG_DATA
    );
    var stepperData: SetWalkthroughVisible;
    stepperData = {
      stepper: 5,
      isMemberAdded: false,
    };
    expect(component.walkthroughData.emit).toHaveBeenCalledWith(stepperData);
  });

  it('should open add env service popup when only service data is present', () => {
    jest
      .spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValue({ afterClosed: () => of(false) });
    jest.spyOn(component.walkthroughData, 'emit');
    component.clientList = ManageClient.CLIENT_RESPONSE.data.result;
    component.clientList[0].environments = null;
    component['services'] = [];
    component.totalEnv = 0;
    component.openAddEnvironmentServicePopup(
      ManageClient.CLIENT_DATA_RESPONSE.result[0]
    );

    expect(component._dialog.open).toHaveBeenCalledWith(
      AddAndUpdateEnvironmentServiceComponent,
      ManageClient.ADD_ENV_SERVICE_MSG_DATA
    );
    var stepperData: SetWalkthroughVisible;
    stepperData = {
      stepper: 5,
      isMemberAdded: false,
    };
    expect(component.walkthroughData.emit).toHaveBeenCalledWith(stepperData);
    component.totalEnv = 1;
    component.openAddEnvironmentServicePopup(
      ManageClient.CLIENT_DATA_RESPONSE.result[0]
    );
  });

  it('should open add env service popup when both environments and services are not present', () => {
    jest
      .spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValue({ afterClosed: () => of(false) });
    jest.spyOn(component.walkthroughData, 'emit');
    component.clientList = ManageClient.CLIENT_RESPONSE.data.result;
    component.clientList[0].environments = null;
    component['services'] = [];
    component.totalEnv = 0;
    component.openAddEnvironmentServicePopup(
      ManageClient.CLIENT_DATA_RESPONSE.result[0]
    );

    expect(component._dialog.open).toHaveBeenCalledWith(
      AddAndUpdateEnvironmentServiceComponent,
      ManageClient.ADD_ENV_SERVICE_MSG_DATA
    );
    var stepperData: SetWalkthroughVisible;
    stepperData = {
      stepper: 5,
      isMemberAdded: false,
    };
    expect(component.walkthroughData.emit).toHaveBeenCalledWith(stepperData);
  });

  it('should set Walkthrough After Adding Env Or Serv', () => {
    jest.spyOn(component.walkthroughData, 'emit');
    var stepperData: SetWalkthroughVisible;
    stepperData = {
      stepper: 5,
      isMemberAdded: false,
    };
    component.setWalkthroughAfterAddingEnvOrServ();

    expect(component.walkthroughData.emit).toHaveBeenCalledWith(stepperData);
  });

  it('should set Walkthrough After Adding Client when client is 1', () => {
    jest.spyOn(component.walkthroughData, 'emit');

    component.totalLength = 1;

    var stepperData: SetWalkthroughVisible;
    stepperData = {
      stepper: 4,
      isMemberAdded: false,
    };
    component.setWalkthroughAfterAddingClient();

    expect(component.walkthroughData.emit).toHaveBeenCalledWith(stepperData);
  });

  it('should not set Walkthrough After Adding Client when client is 0', () => {
    jest.spyOn(component.walkthroughData, 'emit');

    component.totalLength = 0;
    
    var stepperData: SetWalkthroughVisible;
    stepperData = {
      stepper: 4,
      isMemberAdded: true,
    };
    component.setWalkthroughAfterAddingClient();

    expect(component.walkthroughData.emit).toHaveBeenCalledWith(stepperData);
  });

  it('should open edit env service popup', () => {
    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of(true) });

    component['services'] = [];
    component.openEditEnvironmentServicePopup(ManageClient.DEACTIVATE_CLIENT, ManageClient.DEACTIVATE_CLIENT.environments[0]);

    expect(component._dialog.open).toHaveBeenCalledWith(
      AddAndUpdateEnvironmentServiceComponent,
      ManageClient.EDIT_ENV_SERVICE_MSG_DATA
    );
    component.openEditEnvironmentServicePopup(ManageClient.DEACTIVATE_CLIENT, ManageClient.DEACTIVATE_CLIENT.environments[0]);
  });

  it('should not get client list if openEditEnvironmentServicePopup is closed', () => {
    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of(false) });

    const getClientsListSpy = jest.spyOn(component,'getClientsList').mockImplementation();

    component.openEditEnvironmentServicePopup(ManageClient.DEACTIVATE_CLIENT, ManageClient.DEACTIVATE_CLIENT.environments[0]);
    expect(getClientsListSpy).toHaveBeenCalledTimes(0);
  });

  it('should get clients', () => {
    component.clientList = [];
    const clientList = jest
      .spyOn(teamService, 'getClients')
      .mockImplementation(() => of(ManageClient.CLIENT_DATA_RESPONSE));

    const setClientDataSpy = jest
      .spyOn(component, 'setClientData')
      .mockImplementation();

    component.getClientsList();

    expect(clientList).toHaveBeenCalled();
    expect(setClientDataSpy).toHaveBeenCalled();
  });

  it('should throw error while getting clients', () => {
    component.clientList = [];
    const clientList = jest
      .spyOn(teamService, 'getClients')
      .mockImplementation(() => throwError(ManageClient.CLIENT_ERROR_RESPONSE));

    const handleErrorSpy = jest
      .spyOn(component, 'handleError')
      .mockImplementation();

    component.getClientsList();

    expect(clientList).toHaveBeenCalled();
    expect(handleErrorSpy).toHaveBeenCalledWith(ManageClient.CLIENT_ERROR_RESPONSE);
  });

  it('should get clients after sorting via table', () => {
    const startBlockUISpy = jest.spyOn(sharedService, 'startBlockUI').mockImplementation();

    const clientList = jest
      .spyOn(teamService, 'getClients')
      .mockImplementation(() => of(ManageClient.CLIENT_DATA_RESPONSE));

    const setClientDataSpy = jest
      .spyOn(component, 'setClientData')
      .mockImplementation();

    component.sortData(SortBy.SERVICE_REPRESENTATIVE, -1);

    expect(startBlockUISpy).toHaveBeenCalled();
    expect(clientList).toHaveBeenCalled();
    expect(setClientDataSpy).toHaveBeenCalled();
  });

  it('should set prioritized environments', () => {
    component.clientList = ManageClient.CLIENT_DATA_RESPONSE.result;
    component.clientList[0].environments[0].isPrioritized = true;
    const prioritizedEnv = component.clientList[0].environments[0];

    component.setPrioritizedEnv();

    expect(component.clientList[0].isEnvPrioritized[0]).toEqual(prioritizedEnv);
  });

  it('should set inactive CSR status', () => {
    jest.spyOn(localStorage, 'getLocalStorage').mockImplementation(() => JSON.parse(ManageClient.ASSIGNEES));

    component.setClientData(ManageClient.CLIENT_DATA_RESPONSE);

    expect(component.clientList[0].serviceRepresentative.status).toBe(TeamMemberStatus.INACTIVE);
  });

  it('should not set inactive CSR status', () => {
    jest.spyOn(localStorage, 'getLocalStorage').mockImplementation(() => JSON.parse(ManageClient.ASSIGNEES));
    
    component.setClientData(ManageClient.CLIENT_DATA_RESPONSE_SAME_SERVICE_REPRESENTATIVE);
    expect(component.clientList[0].serviceRepresentative.status).not.toBe(TeamMemberStatus.INACTIVE);
  });

  it('should set client data', () => {
    jest.spyOn(sharedService, 'stopBlockUI').mockImplementation();
    jest.spyOn(component, 'setTotalEnvCount').mockImplementation();
    jest.spyOn(component, 'setPrioritizedEnv').mockImplementation();
    jest.spyOn(component, 'initWalkthrough').mockImplementation();
    jest.spyOn(localStorage, 'getLocalStorage').mockImplementation(() => JSON.parse(ManageClient.ASSIGNEES));

    component.setClientData(ManageClient.CLIENT_RESPONSE.data);

    expect(component.clientList[0].serviceRepresentative.status).toBe('inactive')
  });

  it('should set total env count', () => {
    component.totalEnv = 0;
    jest.spyOn(component, 'setTotalEnvCount');
    component.clientList = ManageClient.CLIENT_RESPONSE.data.result;
    component.setTotalEnvCount();
    expect(component.setTotalEnvCount).toHaveBeenCalled();
  });

  it('should init walkthrough when total length is present but no env is added', () => {
    component.totalEnv = 0;
    component.totalLength = 1;
    const setWalkthroughAfterAddingClientSpy = jest
      .spyOn(component, 'setWalkthroughAfterAddingClient')
      .mockImplementation();

    component.initWalkthrough();

    expect(setWalkthroughAfterAddingClientSpy).toHaveBeenCalled();
  });

  it('should init walkthrough when total length is present but and env is added', () => {
    component.totalEnv = 1;
    const setWalkthroughAfterAddingEnvOrServSpy = jest
      .spyOn(component, 'setWalkthroughAfterAddingEnvOrServ')
      .mockImplementation();

    component.initWalkthrough();

    expect(setWalkthroughAfterAddingEnvOrServSpy).toHaveBeenCalled();
  });

  it('should init walkthrough without data', () => {
    component.totalLength = 0;
    component.totalEnv = 0;
    const setWalkthroughSpy = jest.spyOn(component, 'setWalkthrough').mockImplementation();

    component.initWalkthrough();

    expect(setWalkthroughSpy).toHaveBeenCalled();
  });

  it('should expand panel', () => {
    const event = { 
      stopPropagation: () => {},
      target: {}
    };
    const matExpansionPanel = {
      toggle: () => {}
    };
    const _isExpansionIndicatorSpy = jest.spyOn<any, any>(component, '_isExpansionIndicator')
    .mockImplementationOnce(() => false);
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation').mockImplementation();
    const toggleSpy = jest.spyOn(matExpansionPanel, 'toggle').mockImplementation();

    component.expandPanel(matExpansionPanel as MatExpansionPanel, event as Event);
    
    expect(_isExpansionIndicatorSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalled();
  });

  it('should not toggle clicking to expand panel', () => {
    const event = { 
      stopPropagation: () => {},
      target: {}
    };
    const matExpansionPanel = {
      toggle: () => {}
    };
    jest.spyOn<any, any>(component, '_isExpansionIndicator')
    .mockImplementationOnce(() => true);

    const toggleSpy = jest.spyOn(matExpansionPanel, 'toggle').mockImplementation();

    component.expandPanel(matExpansionPanel as MatExpansionPanel, event as Event);

    expect(toggleSpy).toHaveBeenCalledTimes(0);
  });

  it('should change page size', () => {
    const getPaginatedDataSpy = jest
      .spyOn(component, 'getPaginatedData')
      .mockImplementation();

    component.changePageSize(4);
    component.currentPage = 1;

    expect(getPaginatedDataSpy).toHaveBeenCalledWith(4, 1);
  });

  it('should change page', () => {
    const getPaginatedDataSpy = jest
      .spyOn(component, 'getPaginatedData')
      .mockImplementation();

    component.changePage({
      length: 7,
      pageIndex: 1,
      pageSize: 10,
      previousPageIndex: 0,
    });
    component.currentPage = 2;

    expect(getPaginatedDataSpy).toHaveBeenCalledWith(10, 2);
  });

  it('should get paginated data', () => {
    const getClientsSpy = jest
      .spyOn(teamService, 'getClients')
      .mockImplementation(() => of(ManageClient.CLIENT_DATA_RESPONSE));
    const blockUIStart = jest
      .spyOn(sharedService, 'startBlockUI')
      .mockImplementation();
    const setClientDataSpy = jest
      .spyOn(component, 'setClientData')
      .mockImplementation();

    component.getPaginatedData(10, 1);

    expect(blockUIStart).toHaveBeenCalled();
    expect(getClientsSpy).toHaveBeenCalledWith('name', 1, 10, 1, component['searchText']);
    expect(setClientDataSpy).toHaveBeenCalled();
  });
  it('should handle Error', () => {
    const openErrorSnackBar = jest
      .spyOn(sharedService, 'openErrorSnackBar')
      .mockImplementation(() => of(ManageClient.CLIENT_ERROR_RESPONSE));

    component.handleError(ManageClient.CLIENT_ERROR_RESPONSE);

    expect(openErrorSnackBar).toHaveBeenCalledWith(
      ManageClient.CLIENT_ERROR_RESPONSE
    );
    expect(component.isDataLoading).toBeTruthy();
  });

  it('should set walkthrough if total length is 1', () => {
    component.totalLength = 1;

    jest.spyOn(component, 'setWalkthrough');
    jest.spyOn(component.memberLength, 'emit').mockImplementation();

    component.setWalkthrough();

    expect(component.setWalkthrough).toHaveBeenCalled();
    expect(component.memberLength.emit).toHaveBeenCalledWith(true);
  });

  it('should not set walkthrough if total length is 1', () => {
    component.totalLength = 0;

    jest.spyOn(component, 'setWalkthrough');
    jest.spyOn(component.memberLength, 'emit').mockImplementation();

    component.setWalkthrough();

    expect(component.setWalkthrough).toHaveBeenCalled();
    expect(component.memberLength.emit).toHaveBeenCalledWith(false);
  });

  it('should update environment successfully', () => {
    const clientId = '1';
    const environmentId = '1';

    const updateEnvSpy = jest.spyOn(
      teamService,
      'updateEnvironment'
    );

    const openSuccessSnackBar = jest
      .spyOn(sharedService, 'openSuccessSnackBar')
      .mockImplementation(() => of(ManageClient.UPDATE_ENV_SUCCESS));

    component.clientList = cloneDeep(ManageClient.CLIENT_DATA_RESPONSE.result);
    component.updateEnvironment(true, clientId, environmentId);

    expect(updateEnvSpy).toHaveBeenCalledWith(
      '1',
      ManageClient.UPDATE_ENV_PARAMS
    );
    expect(openSuccessSnackBar).toHaveBeenCalledWith(
      ManageClient.UPDATE_ENV_SUCCESS_RESPONSE
    );
  });

  it('should get error while updating environment', () => {
    const clientId = '1';
    const environmentId = '1';

    const updateEnvSpy = jest.spyOn(
      teamService,
      'updateEnvironment'
    );

    jest
      .spyOn(teamService, 'updateEnvironment')
      .mockImplementation(() => throwError(ManageClient.CLIENT_ERROR_RESPONSE));

    const openSnackBarSpy = jest
      .spyOn(sharedService, 'openErrorSnackBar')
      .mockImplementation();

    component.updateEnvironment(true, clientId, environmentId);

    expect(updateEnvSpy).toHaveBeenCalledWith(
      '1',
      ManageClient.UPDATE_ENV_PARAMS
    );
    expect(openSnackBarSpy).toHaveBeenCalledWith(
      ManageClient.CLIENT_ERROR_RESPONSE
    );
  });

  it('should load default data on search input clear', () => {
    const getClientsListSpy = jest
      .spyOn(component, 'getClientsList')
      .mockImplementation();

    component.onSearchInputClear();

    expect(getClientsListSpy).toHaveBeenCalled();
  });

  it('shoud update client without changing env status after deactivating environment if env is not found', () => {
    let deactivatedClientEnv = ManageClient.DEACTIVATE_CLIENT;
    deactivatedClientEnv.environments[0].status = MessageConstant.INACTIVE;

    const updateClientSpy = jest.spyOn<any, any>(component, 'updateClient').mockImplementation();

    component.openDeactivateEnvPopup(deactivatedClientEnv, "2");

    expect(updateClientSpy).toHaveBeenCalledTimes(1);
  });

  it('should update client after changing env status after deactivating environment', () => {
    let deactivatedClientEnv = ManageClient.DEACTIVATE_CLIENT;
    deactivatedClientEnv.environments[0].status = MessageConstant.INACTIVE;
    const updateClientSpy = jest.spyOn<any, any>(component, 'updateClient').mockImplementation();

    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of(true) });

    component.openDeactivateEnvPopup(deactivatedClientEnv, "1");

    expect(updateClientSpy).toHaveBeenCalledWith(deactivatedClientEnv, "1");
  });

  it('should open DeactivateEnvPopup', () => {
    const selectedClient = ManageClient.CLIENT;
    const selectedEnv = selectedClient.environments[0]._id;
    const deactivateEnvironmentSpy = jest.spyOn<any, any>(component, 'deactivateEnvironment').mockImplementation();

    jest.spyOn(TestBed.get(MatDialog), 'open')
      .mockReturnValueOnce({ afterClosed: () => of(true) }).mockReturnValueOnce({ afterClosed: () => of(false) });
    
    component.openDeactivateEnvPopup(selectedClient, selectedEnv);

    expect(deactivateEnvironmentSpy).toHaveBeenCalledWith(selectedClient, selectedEnv);

    component.openDeactivateEnvPopup(selectedClient, selectedEnv);
  });

  it('shoud deactivate client', () => {
    let deactivatedClientEnv = ManageClient.DEACTIVATE_CLIENT;
    deactivatedClientEnv.status = MessageConstant.INACTIVE;

    const updateClientSpy = jest.spyOn<any, any>(component, 'updateClient').mockImplementation();

    component['deactivateClient'](ManageClient.DEACTIVATE_CLIENT);

    expect(updateClientSpy).toHaveBeenCalledWith(deactivatedClientEnv);
  });

  it('should open update client popup', () => {
    const addClientPopupSpy = jest.spyOn<any, any>(component,"addClientPopup").mockImplementation();

    component.openUpdateClientPopup(ManageClient.CLIENT);

    expect(addClientPopupSpy).toHaveBeenCalledWith(MessageConstant.UPDATE_CLIENT, ManageClient.CLIENT);
  });

  it('should remove service', () => {
    const updateClientSpy = jest.spyOn<any, any>(component, "updateClient").mockImplementation();

    const environmentId = ManageClient.CLIENT.environments[0]._id;
    const selectedService = ManageClient.CLIENT.environments[0].services[0];
    let updatedClient = ManageClient.CLIENT;
    updatedClient.environments[0].services.splice(0,1);

    component.removeService(ManageClient.CLIENT, environmentId, selectedService);

    expect(updateClientSpy).toHaveBeenCalledWith(updatedClient, "", selectedService.name);

  });

  it('should not update client if service not found', () => {
    const updateClientSpy = jest.spyOn<any, any>(component, "updateClient").mockImplementation();
    const selectedService = ManageClient.CLIENT.environments[0].services[0];
    let updatedClient = ManageClient.CLIENT;
    updatedClient.environments[0].services.splice(0,1);

    component.removeService(ManageClient.CLIENT, "", selectedService);
    expect(updateClientSpy).toHaveBeenCalledTimes(0);
  });

  it('should set services', () => {
    component['services'] = [];
    const getServicesSpy = jest.spyOn<any, any>(teamService, 'getServices').mockImplementation(() => {
      return of(ManageClient.SERVICES);
    });

    component['setServices']();

    expect(getServicesSpy).toHaveBeenCalled();
    expect(component['services']).toEqual(ManageClient.SERVICES);

  });

  it('should return error while trying to set services', () => {
    jest.spyOn<any, any>(teamService, 'getServices').mockImplementation(() => throwError(ManageClient.CLIENT_ERROR_RESPONSE));

    const openErrorSnackBarSpy = jest.spyOn(sharedService,'openErrorSnackBar').mockImplementation();
    component.ngOnInit();

    expect(openErrorSnackBarSpy).toHaveBeenCalledWith(ManageClient.CLIENT_ERROR_RESPONSE);
  });
});
