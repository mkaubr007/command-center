import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedHomeModule } from '../shared-home/shared-home.module';

import { MaterialModule } from '../../material/material.module';
import { BlockUIModule } from 'ng-block-ui';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ProcessSchedularRoutingModule } from './process-schedular-routing.module';
/*Components*/

import { TooltipModule } from 'ng2-tooltip-directive';
import { ProcessSchedularComponent } from './process-schedular.component';
import { ProcessHeaderComponent } from './shared/process-header/process-header.component';
import { ManageProcessComponent } from './shared/manage-process/manage-process.component';
import { CreateProcessComponent } from './shared/create-process/create-process.component';
import { LinkArgumentComponent } from './shared/link-argument/link-argument.component';
import { ManageArgumentsComponent } from './shared/manage-arguments/manage-arguments.component';
import { CreateArgumentComponent } from './shared/create-argument/create-argument.component';
import { ManageProcessGroupComponent } from './shared/manage-process-group/manage-process-group.component';
import { ProcessGroupComponent } from './shared/process-group/process-group.component';
import { CreateProcessGroupComponent } from './shared/create-process-group/create-process-group.component';
import { ScheduleProgressGroupComponent } from './shared/schedule-progress-group/schedule-progress-group.component';
import { ProcessArgumentsService } from './services/process-arguments.service';
import { ProcessGroupService } from './services/process-group.service';
import { LinkProcessComponent } from './shared/link-process/link-process.component';
import { ScheduleProcessGroupService } from './services/schedule-process-group.service';

// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfsigInterface = {
//   suppressScrollX: true,
// };
@NgModule({
  declarations: [
    ProcessSchedularComponent,
    ProcessHeaderComponent,
    ManageProcessComponent,
    CreateProcessComponent,
    LinkArgumentComponent,
    ManageArgumentsComponent,
    CreateArgumentComponent,
    ManageProcessGroupComponent,
    ProcessGroupComponent,
    CreateProcessGroupComponent,
    ScheduleProgressGroupComponent,
    LinkProcessComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedHomeModule,
    ProcessSchedularRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BlockUIModule.forRoot(),
    PerfectScrollbarModule,
    TooltipModule
  ],
  providers: [
    ProcessArgumentsService,
    ProcessGroupService,
    ScheduleProcessGroupService
  ],
})
export class ProcessSchedularModule {}
