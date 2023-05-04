import { RightService } from './../../../../shared/services/right.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstants } from '../../../../core/constants/route.constants';
import {
  ProcessUrlTab,
  TeamsUrlTab,
} from '../../../../shared/enums/teams-tab.enum';
import { ErrorUrlTab } from '../../../../shared/enums/error-tab.enum';
import { SharedHomeService } from '../../shared-home.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { LocalStorageConstants } from '../../../../core/constants/local-storage.constants';
import { RoleConstants } from '../../../../core/constants/role.constant';
import { map } from 'rxjs/operators';
import { Right } from '../../../../shared/enums/right.enum';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public isAdmin = false;
  public isTeam = false;
  public isProcess = false;

  constructor(
    public _router: Router,
    private _sharedHomeService: SharedHomeService,
    private localStorageService: LocalStorageService,
    private _rightService: RightService
  ) {}

  ngOnInit(): void {
    //This need to be set As per bit masking
    // this.isAdmin = this.localStorageService.getItemInLocalStorageWithoutJSON(LocalStorageConstants.ROLE).toLowerCase() === RoleConstants.ADMIN;

    // Below Code Block to validate if it is admin or not.
    //****************** */
    // let permissionsInbit = parseInt(
    //   localStorage.getItem(LocalStorageConstants.PERMISSION)
    // );

    // this._rightService.getAdminRights().subscribe((AdminPermission:number)=>{

    //   this.isAdmin = (permissionsInbit & AdminPermission) == AdminPermission;

    //   this.isTeam =
    //     (permissionsInbit & Right.TeamRead) == Right.TeamRead ||
    //     (permissionsInbit & Right.TeamWrite) == Right.TeamWrite;

    //     this.isProcess =
    //     (permissionsInbit & Right.CosaNostraRead) == Right.CosaNostraRead ||
    //     (permissionsInbit & Right.CosaNostraWrite) == Right.CosaNostraWrite;

    // },(error:any)=>{

    // });
    //****************** */
    //But To check for bit masking permission Enable all as admin
    this.isAdmin = true;
  }

  redirectToDashborad() {
    this._sharedHomeService.dashboardWalkthrough.next(true);
    this._router.navigate([RouteConstants.DASHBOARD], {
      queryParams: {
        _tab: ErrorUrlTab.NEW,
      },
    });
  }

  redirectToTeam() {
    this._router.navigate([RouteConstants.TEAM_MANAGE], {
      queryParams: {
        _tab: TeamsUrlTab.TEAMS,
      },
    });
  }
  redirectToProcess() {
    this._router.navigate([RouteConstants.MANAGE_PROCESS], {
      queryParams: {
        _tab: ProcessUrlTab.ARGUMENT,
      },
    });
  }
}
