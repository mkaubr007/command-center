import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamComponent } from './team.component';
import { SharedHomeModule } from '../shared-home/shared-home.module';

import { TeamRoutingModule } from './team-routing.module';
import { MaterialModule } from '../../material/material.module';
import { TeamService } from './team.service';
import { BlockUIModule } from 'ng-block-ui';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

/*Components*/
import { AddAndUpdateEnvironmentServiceComponent } from './shared/components/add-and-update-environment-service/add-and-update-environment-service.component';
import { AddAndUpdateClientComponent } from './shared/components/add-and-update-client/add-and-update-client.component';
import { AddAndUpdateTeamComponent } from './shared/components/add-and-update-team/add-and-update-team.component';
import { TeamHeaderComponent } from './shared/components/team-header/team-header.component';
import { ManageClientsComponent } from './shared/components/manage-clients/manage-clients.component';
import { ManageTeamsComponent } from './shared/components/manage-teams/manage-teams.component';
import { ManageRolesComponent } from './shared/components/manage-roles/manage-roles.component';
import { TooltipModule } from 'ng2-tooltip-directive';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
@NgModule({
  declarations: [
    TeamComponent,
    ManageClientsComponent,
    ManageTeamsComponent,
    ManageRolesComponent,
    TeamHeaderComponent,
    AddAndUpdateClientComponent,
    AddAndUpdateTeamComponent,
    AddAndUpdateEnvironmentServiceComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedHomeModule,
    TeamRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BlockUIModule.forRoot(),
    PerfectScrollbarModule,
    TooltipModule
  ],
  providers: [
    TeamService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class TeamModule {}
