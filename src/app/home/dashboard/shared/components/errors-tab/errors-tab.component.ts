import { Subscription } from 'rxjs';
import { IErrorDetailCount } from './../../../../../shared/models/error-detail/error-detail.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { LocalStorageConstants } from 'src/app/core/constants/local-storage.constants';
import {
  ErrorTab,
  ErrorUrlTab
} from '../../../../../shared/enums/error-tab.enum';
import { ErrorService } from './error.service';
import { DashboardService } from '../../../dashboard.service';
import { IDashboardSearchFilters } from '../../../../../shared/models/dashboard/dashboard-search-filters.interface';
import { HomeDropdownConstants } from '../../../../shared-home/components/home-dropdown/home-dropdown.constants';

@Component({
  selector: 'app-errors-tab',
  templateUrl: './errors-tab.component.html',
  styleUrls: ['./errors-tab.component.scss'],
})
export class ErrorsTabComponent implements OnInit, OnDestroy {

  private dashboardFilters$: Subscription;

  public tabsName: any[] = [
    {
      label: ErrorTab.ALL,
      key: ErrorUrlTab.ALL,
      badge: 0,
      disabled: false,
      showCreateJiraButton: false,
      isAssigneeDisabled: false,
      isStatusDisabled: false
    },
    {
      label: ErrorTab.NEW,
      key: ErrorUrlTab.NEW,
      badge: 0,
      disabled: false,
      showCreateJiraButton: true,
      isAssigneeDisabled: false,
      isStatusDisabled: false
    },
    {
      label: ErrorTab.UNRESOLVED_MANUAL,
      key: ErrorUrlTab.UNRESOLVED_MANUAL,
      badge: 0,
      disabled: false,
      showCreateJiraButton: true,
      isAssigneeDisabled: false,
      isStatusDisabled: false
    },
    {
      label: ErrorTab.UNRESOLVED_JIRA,
      key: ErrorUrlTab.UNRESOLVED_JIRA,
      badge: 0,
      disabled: false,
      showCreateJiraButton: false,
      isAssigneeDisabled: true,
      isStatusDisabled: true
    },
    {
      label: ErrorTab.RESOLVED,
      key: ErrorUrlTab.RESOLVED,
      badge: 0,
      disabled: false,
      showCreateJiraButton: false,
      isAssigneeDisabled: true,
      isStatusDisabled: true
    },
  ];
  public errorUrlTabRef = ErrorUrlTab;
  public selectedTab: string;
  public jiraTicketState: any;
  public tabIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private _dashboardService: DashboardService,
    private authService: AuthService,
    public errorService: ErrorService,
  ) { }

  ngOnInit(): void {
    this.setDashboardParamsSubscription();
    this.checkUrl();
    this.getErrorCount();
    this.jiraLogin();
    this.errorService.updateFilterList(this.selectedTab);
  }

  private jiraLogin() {
    this.route.queryParams.subscribe(({ code, state }) => {
      if (code) {
        this.authService.loginUserWithJira({ code, state })
          .subscribe(data => {
            const stateObj = {};
            localStorage.setItem(LocalStorageConstants.IS_JIRA_LOGGEDIN, 'true');

            state.split(';').forEach(item => {
              const keyValue = item.split(':');
              stateObj[keyValue[0]] = keyValue[1];
            });

            this.jiraTicketState = stateObj;
            this.tabIndex = Object.values(this.errorUrlTabRef).indexOf(stateObj['tab']);
            this.selectedTab = stateObj["tab"];
          });
      }
    });
  }

  public async getErrorCount(): Promise<void> {
    const result: IErrorDetailCount = await this.errorService.getErrorCount().toPromise();
    if (result) {
      this.setBadgeCount(result);
    }
  }

  public checkUrl() {
    this.route.queryParamMap.subscribe((params) => {
      const currentTab = params.get('_tab') as ErrorUrlTab;
      if (currentTab) {
        this.selectedTab = currentTab;
      } else {
        this.selectedTab = ErrorUrlTab.NEW;
        this.tabIndex = 1;
      }
    });
  }

  public onTabChange(index: number): void {
    this.errorService.onSearchByErrorChange('', false);
    this.errorService.updateFilterList(this.tabsName[index].key);
    this.errorService.filterDateRange = null;
  }

  public updateBadgeCount(tabAdjustments: any): void {
    for (let field in tabAdjustments) {
      this.tabsName.forEach(tab => {
        if (tab.key === field) {
          tab.badge += tabAdjustments[field];
        }
      });
    }
    this.tabsName = [...this.tabsName];
  }

  private setBadgeCount(result: IErrorDetailCount): void {
    this.tabsName.forEach(tab => {
      switch (tab.key) {
        case ErrorUrlTab.ALL:
          tab.badge = result.allError;
          break;

        case ErrorUrlTab.NEW:
          tab.badge = result.newError;
          break;

        case ErrorUrlTab.UNRESOLVED_MANUAL:
          tab.badge = result.unresolvedManualError;
          break;

        case ErrorUrlTab.UNRESOLVED_JIRA:
          tab.badge = result.unresolvedJiraError;
          break;

        case ErrorUrlTab.RESOLVED:
          tab.badge = result.resolvedError;
          break;
      }
    });
    this.tabsName = [...this.tabsName];
  }

  private setDashboardParamsSubscription(): void {
    this.dashboardFilters$ = this._dashboardService.getDashboardFilters().subscribe((data: IDashboardSearchFilters) => {
      let filters = data;
      if (!filters) {
        filters = {
          clientNames: HomeDropdownConstants.DEFAULT_SELECTED_CLIENTS.map(client => client.name),
          environments : HomeDropdownConstants.DEFAULT_SELECTED_ENVIRONMENTS.map(env => env.name),
          services: HomeDropdownConstants.DEFAULT_SELECTED_SERVICES.map(service => service.name)
        };
      }
      this.errorService.setDashboardFilterMatch(filters);
      this.getErrorCount();
    });
  }

  ngOnDestroy(): void {
    if(this.dashboardFilters$) {
      this.dashboardFilters$.unsubscribe();
    }
  }
}
