import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamsTab } from '../../../../shared/enums/teams-tab.enum';
import { ITab } from '../../../../shared/interface/tab.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public tabsName: ITab[] = [
    { label: TeamsTab.CLIENT_TAB },
    { label: TeamsTab.TEAM_TAB },
    { label: TeamsTab.ROLES_TAB },
  ];

  constructor(public router: Router) {}

  ngOnInit(): void {
    console.log('url:' + this.router.url);
  }
}
