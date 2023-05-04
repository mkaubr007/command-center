import { IDistinctName } from './../../../../shared/models/util/i-distinct-name.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TeamService } from '../../../team/team.service';
import { SharedService } from '../../../../shared/shared.service';
import { MessageConstant } from '../../../../core/constants/message.constant';
import { ErrorService } from '../../../dashboard/shared/components/errors-tab/error.service';
import { HomeDropdownConstants } from './home-dropdown.constants';
import { DashboardService } from '../../../dashboard/dashboard.service';
import { SocketService } from '../../services/socket/socket.service';
import { IDashboardSearchFilters } from '../../../../shared/models/dashboard/dashboard-search-filters.interface';
import { INameCount } from '../../../../shared/models/dashboard/i-name-count.interface';

@Component({
  selector: 'app-home-dropdown',
  templateUrl: './home-dropdown.component.html',
  styleUrls: ['./home-dropdown.component.scss'],
})
export class HomeDropdownComponent implements OnInit, OnDestroy {

  private csrId: string;
  public memberRoles: any;
  public clients: IDistinctName[] = [];
  public environments: INameCount[] = [];
  public services: INameCount[] = [];
  public HomeDropdownConstants = HomeDropdownConstants;
  public selectedClients: IDistinctName[] = HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS;
  public selectedEnvironments: INameCount[] = HomeDropdownConstants.DEFAULT_SELECTED_ENVIRONMENTS;
  public selectedServices: INameCount[] = HomeDropdownConstants.DEFAULT_SELECTED_SERVICES;
  public messageConstant = MessageConstant;
  public loading = {
    clients: false,
    environments: false,
    services: false
  };

  constructor(
    private _teamService: TeamService,
    private _errorService: ErrorService,
    private _dashboardService: DashboardService,
    private _sharedService: SharedService,
    private _socketService: SocketService
  ) {
    if(this._errorService.isRoleCSR) {
      this.csrId = this._errorService.currentUserId;
    }
  }

  ngOnInit(): void {
    this.setSocketSubscription();
    this.getClientNames();
    this.getEnvironmentNames();
    this.getServiceNames();
  }

  ngOnDestroy(): void {
    this._teamService.distinctClients = HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS;
    this._teamService.distinctEnvironments = HomeDropdownConstants.DEFAULT_ENVIRONMENTS;
    this._teamService.distinctServices = HomeDropdownConstants.DEFAULT_SELECTED_SERVICES;
    this._dashboardService.setDashboardFilters(undefined);
  }

  public getClientNames(): void {
    this.loading.clients = true;
    this._teamService.getDistinctClients(this.csrId).subscribe(
      (clientNames: IDistinctName[]) => {
        this.clients = clientNames;
        this.loading.clients = false;
      },
      (error) => {
        this._sharedService.openErrorSnackBar(error);
        this.loading.clients = false;
      }
    );
  }

  public getEnvironmentNames(): void {
    this.loading.environments = true;
    this._teamService.getDistinctEnvironments(this.csrId).subscribe(
      (environmentNames: INameCount[]) => {
        this.environments = environmentNames;
        this.loading.environments = false;
      },
      (error) => {
        this._sharedService.openErrorSnackBar(error);
        this.loading.environments = false;
      }
    );
  }

  public getServiceNames(): void {
    this.loading.services = true;
    this._teamService.getDistinctServices(this.csrId).subscribe(
      (serviceNames: INameCount[]) => {
        this.services = serviceNames;
        this.loading.services = false;
      },
      (error) => {
        this._sharedService.openErrorSnackBar(error);
        this.loading.services = false;
      }
    );
  }

  public onClientChange(clients: IDistinctName[]): void {
    if(clients.includes(HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS[0])) {
      this.selectedClients = [this.clients[0]];
    } else {
      this.selectedClients = clients;
    }
  }

  public onEnvironmentChange(environments: INameCount[]): void {
    if(environments.some(env => env.name === HomeDropdownConstants.ALL_ENVIRONMENTS[0].name)) {
      this.selectedEnvironments = [this.environments[1]];
    } else {
      this.selectedEnvironments = environments;
    }
  }

  public onServiceChange(services: INameCount[]): void {
    if(services.includes(HomeDropdownConstants.DEFAULT_SELECTED_SERVICES[0])) {
      this.selectedServices = [this.services[0]];
    } else {
      this.selectedServices = services;
    }
  }

  public applyFilter(): void {
    const filters: IDashboardSearchFilters = {
      clients: this.selectedClients.map(client => client._id),
      environments: this.selectedEnvironments.map(env => env.name),
      services: this.selectedServices.map(service => service.name),
      clientNames: this.selectedClients.map(client => client.name)
    };
    this._dashboardService.setDashboardFilters(filters);
  }

  private setSocketSubscription(): void {
    this._socketService.onDeactivatedClient().subscribe((filter: any) => {
      if(filter) {
        this.updateListing(filter);
      }
    });

    this._socketService.activateClient().subscribe((filter: any) => {
      if(filter) {
        this.addNewClientEnv(filter);
      }
    });
  }

  private updateListing(params: string): void {
    const deactivatedClient: IDashboardSearchFilters = JSON.parse(params);
    this.clients = this._teamService.distinctClients = this.clients.filter(distinctClient => distinctClient._id !== deactivatedClient.clients);
    this.environments = this._teamService.distinctEnvironments = this.getDifference(this.environments, deactivatedClient.environments as string[]);
    this.services = this._teamService.distinctServices = this.getDifference(this.services, deactivatedClient.services as string[]);
  }

  private addNewClientEnv(client: string): void {
    const activatedClient = JSON.parse(client);
    if(activatedClient.clients && activatedClient.clients['_id']) {
      this.clients = this._teamService.distinctClients = this.clients.push(activatedClient.clients) as any;
    }
    this.addNewValue(activatedClient.environments, HomeDropdownConstants.ENVIRONMENTS.toLowerCase());
    this.addNewValue(activatedClient.services, HomeDropdownConstants.SERVICES.toLowerCase());
  }

  private addNewValue(params: string[], field: string): void {
    if(params.length) {
      params.forEach(param => {
        const index = this[field].findIndex(item => item.name === param);
        if(index !== -1) {
          this[field][index].count += 1;
        } else {
          this[field].push({ count : 1, name: param });
        }
      });
      if(field === HomeDropdownConstants.ENVIRONMENTS.toLowerCase()) {
        this._teamService.distinctEnvironments = this.environments;
      } else {
        this._teamService.distinctServices = this.services;
      }
    }
  }

  private getDifference(originalArray: INameCount[], itemsToRemove: string[]): INameCount[] {
    originalArray.forEach(item => {
      if(itemsToRemove.includes(item.name)) {
        item.count -= 1;
      }
    });
    return originalArray.filter(item => item.count > 0);
  }
}
