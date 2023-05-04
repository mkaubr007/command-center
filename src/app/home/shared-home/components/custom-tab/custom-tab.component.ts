import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter, OnChanges, ChangeDetectorRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProcessUrlTab, TeamsUrlTab } from '../../../../shared/enums/teams-tab.enum';
import { RouteConstants } from '../../../../core/constants/route.constants';
import { ErrorUrlTab } from '../../../../shared/enums/error-tab.enum';
import { ITab } from 'src/app/shared/interface/tab.interface';
import { ErrorService } from "../../../dashboard/shared/components/errors-tab/error.service"

@Component({
  selector: 'app-custom-tab',
  templateUrl: './custom-tab.component.html',
  styleUrls: ['./custom-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomTabComponent implements OnInit, OnChanges {
  readonly tabs = [TeamsUrlTab.CLIENT, TeamsUrlTab.TEAMS, TeamsUrlTab.ROLES];
  readonly processSchedulerTabs = [ProcessUrlTab.PROCESS_GROUP, ProcessUrlTab.PROCESS, ProcessUrlTab.ARGUMENT];
  readonly errorTab = [
    ErrorUrlTab.ALL,
    ErrorUrlTab.NEW,
    ErrorUrlTab.UNRESOLVED_MANUAL,
    ErrorUrlTab.UNRESOLVED_JIRA,
    ErrorUrlTab.RESOLVED,
  ];

  readonly envServicePopupTabs = ['Environment', 'Service'];
  @Input() selectedTab = 0;
  @Input() tabsName: ITab[];
  @Input() updateUrl: boolean;
  @Input() defaultTab: string;
  @Input() placement: string;
  @Output() selectedPopupTab: EventEmitter<number> = new EventEmitter();
  @Output() tabChange: EventEmitter<number> = new EventEmitter();


  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _errorService: ErrorService,
    private _cd: ChangeDetectorRef,
  ) { }

  ngOnChanges(): void {
    this._errorService.getTotalErrorCount().subscribe(({ count, tabLabel }) => {
      this.tabsName[this.tabsName.findIndex(({ key }) => key === tabLabel)].badge = count;
      this._cd.detectChanges();
    });
  }

  ngOnInit(): void {
    this.setSelectedTab();
  }

  public setSelectedTab(): void {

    switch (!this.updateUrl) {
      case this.placement === 'header':
        this._route.queryParamMap.subscribe((params) => {
          this.selectedTab = this.tabs.indexOf(<TeamsUrlTab>params.get('_tab'));
        });
        break;

      case this.placement === 'header-process-tab':
        this._route.queryParamMap.subscribe((params) => {
          this.selectedTab = this.processSchedulerTabs.indexOf(<ProcessUrlTab>params.get('_tab'));
        });
      break;

      case this.placement === 'body':
        this._route.queryParamMap.subscribe((params) => {
          this.selectedTab = this.errorTab.indexOf(
            <ErrorUrlTab>params.get('_tab')
          );
        });
        break;
    }
    if (this.updateUrl) {
      this.selectedTab = this.envServicePopupTabs.indexOf(this.defaultTab);
    }
  }

  public onTabChange(event: number): void {
    this.tabChange.emit(event);

    switch (!this.updateUrl) {
      case this.placement === 'header':
        this.nagivateTo(RouteConstants.TEAM_MANAGE, this.tabs[event]);
        break;

      case this.placement === 'header-process-tab':
        this.nagivateTo('process-scheduler', this.processSchedulerTabs[event]);
      break;

      case this.placement === 'body':
        this.nagivateTo(RouteConstants.DASHBOARD, this.errorTab[event]);
        break;
    }
    if (!this.updateUrl) {
      this.selectedPopupTab.emit(event);
    }
  }

  private nagivateTo(route: string, tab: string): void {
    this._router.navigate([route], {
      queryParams: {
        _tab: tab,
      },
    });
  }
}
