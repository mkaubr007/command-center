import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessSharedService } from 'src/app/home/process-scheduler/services/process-shared.service';
import { ProcessUrlTab } from 'src/app/shared/enums/process-tab.enum';
import { IDistinctName } from 'src/app/shared/models/util/i-distinct-name.interface';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-process-header-dropdown',
  templateUrl: './process-header-dropdown.component.html',
  styleUrls: ['./process-header-dropdown.component.scss']
})
export class ProcessHeaderDropdownComponent implements OnInit {

  public activeTab: ProcessUrlTab;
  public activeTabIndex: number = 0;
  public selectedClient: string;
  public selectedEnvironment: string;
  public tabRef = ProcessUrlTab;

  public clients: IDistinctName[] = [];
  public environments: IDistinctName[] = [];
  public loading = {
    clients: false,
    environments: false
  };

  constructor(public _processSharedService: ProcessSharedService,
              private _sharedService: SharedService,
              private _route: ActivatedRoute,
              public _dialog: MatDialog) { }

  ngOnInit(): void {

    this.getClientNames();
    this.getEnvironmentNames();
    this.subscribeToQueryParams();
    this.getCurrentFiltersSelection();
    
  }

  private getCurrentFiltersSelection() {
    const currentSelection = this._processSharedService.selectedClientEnvironment.value;
    if(currentSelection && currentSelection.environment && currentSelection.environment !== '') {
      this.selectedClient = currentSelection.client;
      this.selectedEnvironment = currentSelection.environment;
    }
  }

  subscribeToQueryParams() {
    this._route.queryParamMap.subscribe((params) => {
      this.activeTab = <ProcessUrlTab>params.get('_tab');
      this.activeTabIndex = Object.values(ProcessUrlTab).indexOf(this.activeTab);
      this.getCurrentFiltersSelection();
    });
  }

  checkIfSelectionsValid(): boolean {
    let isValid: boolean = false;

    if(this.activeTab === ProcessUrlTab.PROCESS_GROUP) {
      if(this.selectedClient?.length && this.selectedEnvironment?.length) {
        isValid = true;
      }
    }
    else {
      if(this.selectedEnvironment?.length) {
        isValid = true;
      } 
    }

    return isValid;
  }

  applyFilter() {
    this._processSharedService.selectedClientEnvironment.next({
      client: this.selectedClient,
      environment: this.selectedEnvironment
    });
  }

  onClientSelectionChanged(client: any) {
    if(client) {
      this.selectedClient = client;
    }
  } 

  onEnvironmentSelectionChanged(env: any) {
    if(env) {
      this.selectedEnvironment = env;
    }
  }

  private getClientNames(): void {
    this.loading.clients = true;
    this._processSharedService.getDistinctClientsForSingleSelection().subscribe(
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

  private getEnvironmentNames(): void {
    this.loading.environments = true;
    this._processSharedService.getDistinctEnvironmentsForSingleSelection().subscribe(
      (environmentNames: IDistinctName[]) => {
        this.environments = environmentNames;
        this.loading.environments = false;
      },
      (error) => {
        this._sharedService.openErrorSnackBar(error);
        this.loading.environments = false;
      }
    );
  }
}
