import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*Components*/
import { ServiceComponent } from './shared/components/service/service.component';
import { TeamOverviewComponent } from './shared/components/team-overview/team-overview.component';
import { FileProcessingComponent } from './shared/components/file-processing/file-processing.component';

import { ErrorsTabComponent } from './shared/components/errors-tab/errors-tab.component';

/*Module*/
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../../material/material.module';
import { SharedHomeModule } from '../shared-home/shared-home.module';

/*Scrollbar*/
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DashboardComponent } from './dashboard.component';
import { DashboardHeaderComponent } from './shared/components/dashboard-header/dashboard-header.component';
import { ErrorService } from './shared/components/errors-tab/error.service';

import { NgSelectModule } from '@ng-select/ng-select';
import { StatusService } from '../../shared/services/status.service';
import { CreateEditJiraTicketComponent } from './shared/components/create-edit-jira-ticket/create-edit-jira-ticket.component';
import { ErrorsTableComponent } from './shared/errors-table/errors-table.component';
import { ErrorFilterComponent } from './shared/components/error-filter/error-filter.component';
import { ErrorFilterListComponent } from './shared/components/error-filter-list/error-filter-list.component';
import { ErrorFilterDisplayComponent } from './shared/components/error-filter-display/error-filter-display.component';
import { CsvExportModule } from 'src/app/shared/modules/csv-export/csv-export.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    DashboardComponent,
    ServiceComponent,
    TeamOverviewComponent,
    FileProcessingComponent,
    ErrorsTabComponent,
    DashboardHeaderComponent,
    CreateEditJiraTicketComponent,
    ErrorsTableComponent,
    ErrorFilterComponent,
    ErrorFilterListComponent,
    ErrorFilterDisplayComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedHomeModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    BlockUIModule.forRoot(),
    DashboardRoutingModule,
    NgSelectModule,
    FormsModule,
    CsvExportModule,
  ],
  providers: [
    ErrorService,
    StatusService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class DashboardModule {}
