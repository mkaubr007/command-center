import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/*Modules*/
import { HomeRoutingModule } from './home-routing.module';
import { MaterialModule } from '../material/material.module';
import { SharedHomeModule } from './shared-home/shared-home.module';
import { TeamModule } from './team/team.module';
import { DashboardModule } from './dashboard/dashboard.module';

/*Components*/
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { SocketService } from './shared-home/services/socket/socket.service';
import { ProcessSchedularModule } from './process-scheduler/process-schedular.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    SharedHomeModule,
    TeamModule,
    DashboardModule,
    ProcessSchedularModule
  ],
  providers: [HomeService, SocketService],
})
export class HomeModule {}
