import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TeamOverviewTable } from '../../../../../shared/enums/team-overview.enum';
import { MatTableDataSource } from '@angular/material/table';
import { MessageConstant } from '../../../../../core/constants/message.constant';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { RouteConstants } from '../../../../../core/constants/route.constants';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../dashboard.service';
import { IDashboardSearchFilters } from '../../../../../shared/models/dashboard/dashboard-search-filters.interface';
import { HomeDropdownConstants } from '../../../../shared-home/components/home-dropdown/home-dropdown.constants';
import { ErrorService } from '../errors-tab/error.service';
import { SharedService } from '../../../../../shared/shared.service';
import { ITeamOverview } from '../../../../../shared/models/team-member/team-member';

@Component({
  selector: 'app-team-overview',
  templateUrl: './team-overview.component.html',
  styleUrls: ['./team-overview.component.scss'],
})
export class TeamOverviewComponent implements OnInit, OnDestroy {
  public messageConstants = MessageConstant;
  public imageUrl = RouteConstants.NO_USER_IMAGE_PATH;
  public teamOverviewLength: number;
  public dataSource = new MatTableDataSource();
  public displayedColumns: string[] = [
    TeamOverviewTable.SUPPORT_PERSON,
    TeamOverviewTable.OPENED,
    TeamOverviewTable.ASSIGNED,
  ];
  public teamOverviewList: ITeamOverview[] = [];
  public isDataLoading = false;

  private dashboardFilters$: Subscription;
  private teamOverviewRefresh$: Subscription;
  @ViewChild(PerfectScrollbarDirective, { static: false })
  directiveRef?: PerfectScrollbarDirective;

  constructor(
    private _dashboardService: DashboardService,
    private _errorService: ErrorService,
    private _sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.setDashboardParamsSubscription();
    this.setTeamOverviewRefreshSubscription();
  }

  ngOnDestroy(): void {
    if (this.dashboardFilters$) {
      this.dashboardFilters$.unsubscribe();
    }
    if(this.teamOverviewRefresh$) {
      this.teamOverviewRefresh$.unsubscribe();
    }
  }

  private setDashboardParamsSubscription(): void {
    this.dashboardFilters$ = this._dashboardService
      .getDashboardFilters()
      .subscribe((data: IDashboardSearchFilters) => {
        let filters = data;
        if (!filters) {
          filters = {
            clientNames: HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS.map(
              (client) => client.name
            ),
            environments: HomeDropdownConstants.DEFAULT_SELECTED_ENVIRONMENTS.map(
              (env) => env.name
            ),
            services: HomeDropdownConstants.DEFAULT_SELECTED_SERVICES.map(
              (service) => service.name
            ),
          };
        }
        if (!this.isDataLoading) {
          this.isDataLoading = true;
          this._errorService.setDashboardFilterMatch(filters);
          this.getTeamMemberOverview();
        }
      });
  }

  private setTeamOverviewRefreshSubscription(): void {
    this.teamOverviewRefresh$ = this._errorService.refreshTeamOverview().subscribe(() => {
      this.isDataLoading = true;
      this.getTeamMemberOverview();
    });
  }

  private setData(): void {
    this.dataSource = new MatTableDataSource(this.teamOverviewList);
    this.teamOverviewLength = this.teamOverviewList.length;
  }

  private getTeamMemberOverview(): void {
    this._errorService.getTeamMemberOverview().subscribe(
      (response: ITeamOverview[]) => {
        this.teamOverviewList = response;
        this.isDataLoading = false;
        this.setData();
      },
      (error) => {
        this.isDataLoading = false;
        this._sharedService.openErrorSnackBar(error);
      }
    );
  }
}
