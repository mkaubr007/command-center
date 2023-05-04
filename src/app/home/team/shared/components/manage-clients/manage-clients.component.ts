import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeamMemberStatus, TeamsUrlTab } from '../../../../../shared/enums/teams-tab.enum';
import { AddAndUpdateClientComponent } from '../add-and-update-client/add-and-update-client.component';
import { MessageConstant } from '../../../../../core/constants/message.constant';
import { MatExpansionPanel } from '@angular/material/expansion';
import { IPaginator } from '../../../../../shared/models/paginator/paginator.interface';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { AddAndUpdateEnvironmentServiceComponent } from '../add-and-update-environment-service/add-and-update-environment-service.component';
import { DeleteComponent } from '../../../../shared-home/components/delete/delete.component';
import { TeamService } from '../../../team.service';
import { SetWalkthroughVisible } from '../../../../../shared/models/walkthrough/walkthrough.model';
import {IClient, IClientResponseData, IClientEnvResponse, IEnvironments, IService} from '../../../../../shared/models/client-service-rep/client-service-rep';
import { SharedService } from '../../../../../shared/shared.service';
import { IErrorResponse } from '../../../../../shared/models/error/error.interface';
import { SortBy, OrderBy } from '../../../../../shared/enums/sorting.enum';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { CssConstant } from '../../../../../core/constants/css.constant';
import { RouteConstants } from '../../../../../core/constants/route.constants';
import { ApiResponse } from '../../../../../shared/models/util/api-response';
import { SocketService } from '../../../../shared-home/services/socket/socket.service';
import { LocalStorageConstants } from '../../../../../core/constants/local-storage.constants';
import { LocalStorageService } from '../../../../../core/services/local-storage.service';

@Component({
  selector: 'app-manage-clients',
  templateUrl: './manage-clients.component.html',
  styleUrls: ['./manage-clients.component.scss'],
})
export class ManageClientsComponent implements OnInit, OnDestroy {
  public messageConstants = MessageConstant;
  public imageUrl = RouteConstants.NO_USER_IMAGE_PATH;

  public defaultPageLimit = 10;
  public currentPage = 1;
  public defaultSortBy = SortBy.NAME;
  public defaultOrderBy = OrderBy.ASC;
  public sortByRf = SortBy;
  public orderByRef = OrderBy;
  public totalLength: number;
  public isDataLoading = true;
  public totalEnv = 0;
  public isSearch = false;
  public clientList: IClient[];
  public teamMemberStatus = TeamMemberStatus;
  private services: IService[] = [];

  @Output() walkthroughData: EventEmitter<
    SetWalkthroughVisible
  > = new EventEmitter();
  @Output() memberLength: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(PerfectScrollbarDirective, { static: false })
  directiveRef?: PerfectScrollbarDirective;
  private inputSubscription: Subscription;
  private searchText: string;

  constructor(
    public _dialog: MatDialog,
    private _teamService: TeamService,
    private _sharedService: SharedService,
    private _socketService: SocketService,
    private _localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getClientsList();
    this.onSearchClientSubscription();
    this.setServices();
  }

  ngOnDestroy(): void {
    if(this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }

  public getClientsList(): void {
    this._sharedService.startBlockUI();
    this.isDataLoading = true;
    this.clientList = [];
    this._teamService
      .getClients(
        this.defaultSortBy,
        this.defaultOrderBy,
        this.defaultPageLimit,
        this.currentPage,
        this.searchText
      )
      .subscribe(
        (response: IClientResponseData) => {
          this.setClientData(response);
        },
        (error: IErrorResponse) => {
          this.handleError(error);
        }
      );
  }

  public setWalkthrough(): void {
    if (this.totalLength) {
      this.memberLength.emit(true);
    } else {
      this.memberLength.emit(false);
    }
  }

  public sortData(sortBy: string, orderBy: number): void {
    this._sharedService.startBlockUI();
    this.defaultOrderBy = -orderBy;
    sortBy === SortBy.SERVICE_REPRESENTATIVE
      ? (this.defaultSortBy = SortBy.SERVICE_REPRESENTATIVE_NAME)
      : (this.defaultSortBy = SortBy.NAME);
    this._teamService
      .getClients(
        this.defaultSortBy,
        this.defaultOrderBy,
        this.defaultPageLimit,
        this.currentPage
      )
      .subscribe((response: IClientResponseData) => {
        this.setClientData(response);
      });
  }

  public changePage(event: IPaginator): void {
    this.currentPage = event.pageIndex + 1;
    this.getPaginatedData(this.defaultPageLimit, this.currentPage);
  }

  public changePageSize(event: number): void {
    this.defaultPageLimit = event;
    this.currentPage = 1;
    this.getPaginatedData(event, this.currentPage);
  }

  public getPaginatedData(limit: number, currentPage: number): void {
    this._sharedService.startBlockUI();
    this._teamService
      .getClients(this.defaultSortBy, this.defaultOrderBy, limit, currentPage, this.searchText)
      .subscribe((response: IClientResponseData) => {
        this.setClientData(response);
      });
  }

  public setPrioritizedEnv(): void {
    this.clientList.forEach((value) => {
      value['isEnvPrioritized'] = value.environments.filter(
        env => env.isPrioritized && env.status === MessageConstant.ACTIVE
      );
    });
  }

  public setClientData(response: IClientResponseData): void {
    this.clientList = response.result;
    this.setInactiveCsrStatus();
    this.totalLength = response.count;
    this._sharedService.stopBlockUI();
    this.isDataLoading = false;
    this.setTotalEnvCount();
    this.setPrioritizedEnv();
    this.initWalkthrough();
  }

  private setInactiveCsrStatus(){
    const activeAssignees = this._localStorageService.getLocalStorage(LocalStorageConstants.ASSIGNEES);
    this.clientList.forEach(x => {
      if (!activeAssignees.map(activeAssignee => activeAssignee.id).includes(x.serviceRepresentative.id)) {
        x.serviceRepresentative.status = TeamMemberStatus.INACTIVE;
      }
    });
  }
  public setTotalEnvCount(): void {
    this.clientList.forEach((value) => {
      if (value.environments &&
        value.environments.length &&
        this.totalEnv < value.environments.length
      ) {
        this.totalEnv = value.environments.length;
      }
    });
  }

  public initWalkthrough(): void {
    if (this.totalLength && !this.totalEnv) {
      this.setWalkthroughAfterAddingClient();
    } else if (this.totalEnv === 1) {
      this.setWalkthroughAfterAddingEnvOrServ();
    } else {
      this.setWalkthrough();
    }
  }

  public expandPanel(matExpansionPanel: MatExpansionPanel, event: Event): void {
    event.stopPropagation();
    if (!this._isExpansionIndicator(event.target as HTMLInputElement)) {
      matExpansionPanel.toggle();
    }
  }

  public updateEnvironment(
    checked: boolean,
    clientId: string,
    environmentId: string
  ): void {
    const params = {
      id: environmentId,
      arrField: 'environments',
      keyToUpdate: 'isPrioritized',
      value: checked,
      elementKey: '_id',
    };
    this._teamService.updateEnvironment(clientId, params).subscribe(
      (response: ApiResponse<IClientEnvResponse>) => {
        this.setPrioritizedEnv();
        this._sharedService.openSuccessSnackBar(response);
      },
      (error) => {
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }

  private _isExpansionIndicator(target: HTMLInputElement): boolean {
    return target.classList && target.classList.contains(CssConstant.TOGGLE_ICON);
  }

  public openAddEnvironmentServicePopup(client: IClient): void {
    const dialogRef = this._dialog.open(
      AddAndUpdateEnvironmentServiceComponent,
      {
        width: CssConstant.ADD_SERVICE_ENV_POPUP_WIDTH,
        disableClose: true,
        scrollStrategy: new NoopScrollStrategy(),
        data: {
          title: MessageConstant.ADD_NEW_ENVIRONMENT,
          btnTxt: MessageConstant.ADD,
          btnSubTxt: MessageConstant.CANCEL,
          component: TeamsUrlTab.CLIENT,
          isDisabled: false,
          client,
          services: this.services
        },
      }
    );

    dialogRef
      .afterClosed()
      .subscribe((isServiceOrEnvironmentAdded: boolean) => {
        if (isServiceOrEnvironmentAdded) {
          this.setServices();
          this.getClientsList();
        } else {
          if (!this.totalEnv) {
            this.setWalkthroughAfterAddingEnvOrServ();
          }
        }
      });
  }

  public setWalkthroughAfterAddingEnvOrServ(): void {
    const stepperData: SetWalkthroughVisible = {
      stepper: 5,
      isMemberAdded: false,
    };

    this.walkthroughData.emit(stepperData);
  }

  public openEditEnvironmentServicePopup(client: IClient, environment: IEnvironments): void {
    const dialogRef = this._dialog.open(
      AddAndUpdateEnvironmentServiceComponent,
      {
        width: CssConstant.ADD_SERVICE_ENV_POPUP_WIDTH,
        disableClose: true,
        scrollStrategy: new NoopScrollStrategy(),
        data: {
          title: MessageConstant.ADD_OR_UPDATE,
          btnTxt: MessageConstant.UPDATE,
          btnSubTxt: MessageConstant.CANCEL,
          component: TeamsUrlTab.CLIENT,
          isDisabled: false,
          client,
          environment,
          services: this.services
        },
      }
    );

    dialogRef.afterClosed().subscribe((event: boolean) => {
      if (event) {
        this.setServices();
        this.getClientsList();
      }
    });
  }

  public openAddClientPopup(): void {
    this.addClientPopup(MessageConstant.ADD_NEW_CLIENT);
  }

  public openUpdateClientPopup(client: IClient): void {
    this.addClientPopup(MessageConstant.UPDATE_CLIENT, client);
  }

  public addClientPopup(title: string, client?: IClient): void {
    const dialogRef = this._dialog.open(AddAndUpdateClientComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title,
        btnTxt: MessageConstant.SAVE,
        btnSubTxt: MessageConstant.CANCEL,
        component: TeamsUrlTab.CLIENT,
        client
      },
    });

    dialogRef.afterClosed().subscribe((event: boolean) => {
      if (event) {
        this.getClientsList();
      }
    });
  }

  public setWalkthroughAfterAddingClient(): void {
    let stepperData: SetWalkthroughVisible;
    if (this.totalLength === 1) {
      stepperData = {
        stepper: 4,
        isMemberAdded: false,
      };
    } else {
      stepperData = {
        stepper: 4,
        isMemberAdded: true,
      };
    }
    this.walkthroughData.emit(stepperData);
  }

  public openDeactivateServicePopup(client: IClient, environmentId: string, selectedService: IService): void {
    const dialogRef = this.openDeactivatePopup(MessageConstant.REMOVE_SERVICE, MessageConstant.DEACTIVE_SERVICE_TXT, MessageConstant.REMOVE);
    dialogRef.afterClosed().subscribe((deactivate: boolean) => {
      if(deactivate) {
        this.removeService(client, environmentId, selectedService);
      }
    });
  }

  public openDeactivateClientPopup(client: IClient): void {
    const dialogRef = this.openDeactivatePopup(MessageConstant.DEACTIVATE_CLIENT, MessageConstant.DELETE_CLIENT_TXT, MessageConstant.DEACTIVATE);
    dialogRef.afterClosed().subscribe((deactivate: boolean) => {
      if(deactivate) {
        this.deactivateClient(client);
      }
    });
  }

  public removeService(client: IClient, environmentId: string, selectedService: IService): void {
    const index = client.environments.findIndex(env => env._id === environmentId);
    if(index !== -1) {
      let environment = client.environments[index];
      environment.services = environment.services.filter(service => service._id !== selectedService._id);
      client.environments[index] = environment;
      this.updateClient(client, "", selectedService.name);
    }
  }

  public openDeactivateEnvPopup(client: IClient, environmentId: string): void {
    const dialogRef = this.openDeactivatePopup(MessageConstant.DEACTIVATE_ENVIRONMENT, MessageConstant.DELETE_CLIENT_TXT, MessageConstant.DEACTIVATE);
    dialogRef.afterClosed().subscribe((deactivate: boolean) => {
      if(deactivate) {
        this.deactivateEnvironment(client, environmentId);
      }
    });
  }

  private deactivateEnvironment(client:IClient, environmentId: string): void {
    const index = client.environments.findIndex(env => env._id === environmentId);
    if(index !== -1) {
      client.environments[index].status = MessageConstant.INACTIVE;
    }
    this.updateClient(client, environmentId);
  }

  private deactivateClient(client: IClient): void {
    client.status = MessageConstant.INACTIVE;
    client.serviceRepresentative = undefined;
    this.updateClient(client);
  }

  private openDeactivatePopup(title: string, subTitle: string, btnTxt: string) {
    const dialogRef = this._dialog.open(DeleteComponent, {
      width: CssConstant.POPUP_WIDTH,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        title,
        subTitle,
        btnTxt,
        btnSubTxt: MessageConstant.CANCEL,
      },
    });

    return dialogRef;
  }

  private updateClient(client: IClient, environmentId?: string, serviceName?: string): void {
    this._teamService.updateClient(client._id, client).subscribe(response => {
      this.updateActiveClientEnvListing(client, environmentId, serviceName);
      this._sharedService.openSuccessSnackBar(response);
      this.getClientsList();
    }, error => {
      this._sharedService.openErrorSnackBar(error);
    });
  }

  private updateActiveClientEnvListing(client: IClient, environmentId: string, serviceName: string): void {
    let deactivatedClientEnv = {
      clients: "",
      environments : [],
      services: []
    };

    if(serviceName) {
      deactivatedClientEnv.services.push(serviceName);
    } else if(environmentId) {
      const deactivatedEnv = client.environments.find(env => env._id === environmentId);
      deactivatedClientEnv.environments.push(deactivatedEnv.name);
      deactivatedClientEnv.services = deactivatedClientEnv.services.concat(deactivatedEnv.services.map(service => service.name));
    } else {
      deactivatedClientEnv.clients = client._id;
      client.environments.forEach(env => {
        deactivatedClientEnv.environments.push(env.name);
        deactivatedClientEnv.services = deactivatedClientEnv.services.concat(env.services.map(service => service.name));
      });
    }
    this._socketService.emitDeactivatedClient(deactivatedClientEnv);
  }

  public filterActiveEnvironments(environments: IEnvironments[]): IEnvironments[] {
    return environments.filter(env => env.status === MessageConstant.ACTIVE);
  }

  public handleError(error: IErrorResponse): void {
    this.isDataLoading = true;
    this._sharedService.openErrorSnackBar(error);
    this._sharedService.stopBlockUI();
  }

  private onSearchClientSubscription(): void {
    this.inputSubscription = this._teamService.getInputValue().subscribe((value) => {
      this.isSearch = true;
      this.searchText = value;
      this.getClientsList();
    });
  }

  public onSearchInputClear(): void {
    this.isSearch = false;
    this.searchText = '';
    this.getClientsList();
  }

  private setServices(): void {
    this._teamService.getServices().subscribe((response: IService[]) => {
      this.services = response;
    }, error => {
      this._sharedService.openErrorSnackBar(error);
    });
  }
}