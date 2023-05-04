import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  ServiceHealth,
  ServiceHealthTable,
} from '../../../../../shared/enums/service-health.enum';
import { MessageConstant } from '../../../../../core/constants/message.constant';
import { DashboardService } from '../../../dashboard.service';
import { tz } from 'moment-timezone';
import { SharedService } from '../../../../../shared/shared.service';
import { IErrorResponse } from '../../../../../shared/models/error/error.interface';
import { IDashboardSearchFilters } from '../../../../../shared/models/dashboard/dashboard-search-filters.interface';
import { HomeDropdownConstants } from '../../../../shared-home/components/home-dropdown/home-dropdown.constants';

const moment = require('moment').default || require('moment');

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit, OnDestroy {
  public isDataLoading = true;
  public serviceHealthEnumRef = ServiceHealth;
  public messageConstants = MessageConstant;
  public serviceHealthTableRef = ServiceHealthTable;
  public serviceCount: number;
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = [
    ServiceHealthTable.SERVICE,
    ServiceHealthTable.CLIENT,
    ServiceHealthTable.ENVIRONMENT,
    ServiceHealthTable.CHECK_IN_STATUS,
    ServiceHealthTable.NEW_ERRORS,
  ];
  public lastUpdated = '...';
  private dashboardFilters: IDashboardSearchFilters = {
    clients: HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS.map(client => client._id),
    environments : HomeDropdownConstants.DEFAULT_SELECTED_ENVIRONMENTS.map(env => env.name),
    services: HomeDropdownConstants.DEFAULT_SELECTED_SERVICES.map(service => service.name)
  };
  private dashboardFilters$: Subscription;

  constructor(
    private _dashboardService: DashboardService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.setFilterSubsciption();
    this.getDashboardData();
  }

  ngOnDestroy(): void {
    this.dashboardFilters$.unsubscribe();
  }

  public getDashboardData(): void {
    const cachedLastUpdated = this.lastUpdated;
    this.lastUpdated = '...';
    this.isDataLoading = true;
    this._dashboardService
      .getPrioritisedEnvironmentServices(this.dashboardFilters)
      .subscribe(
        (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.serviceCount = response.length;
          this.isDataLoading = false;
          this.lastUpdated = this.dateLabel(new Date().toISOString());
        },
        (error: IErrorResponse) => {
          this.handleError(error);
          this.lastUpdated = cachedLastUpdated;
        }
      );
  }

  public dateLabel(dateISO: string): string {
    const guess = tz.guess(true);
    const zone = tz.zone(guess);
    const abbr = zone.abbr(new Date(dateISO).getTime());

    const date = moment(dateISO).format('MM/DD/YYYY');

    const time = new Date(dateISO)
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
      .toLocaleLowerCase();

    return time + ' ' + abbr + ' ' + date;
  }

  public handleError(error: IErrorResponse): void {
    this.isDataLoading = true;
    this._sharedService.openErrorSnackBar(error);
  }

  public setFilterSubsciption(): void {
    this.dashboardFilters$ = this._dashboardService.getDashboardFilters().subscribe((filters: IDashboardSearchFilters) => {   
        if(!this.isDataLoading && filters) {
          this.dashboardFilters = filters;
          this.getDashboardData();
        }
    });
  }
}
