import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { AuthService } from './auth/auth.service';
import { JiraService } from './shared/services/jira.service';
import { CacheService } from './home/cache-service';
import { TeamService } from './home/team/team.service';
import { AssigneeDropdownCacheService } from './services/assignee-dropdown-service/assignee-dropdown.cache.service';
import { DashboardService } from './home/dashboard/dashboard.service';
import { WebSocketService } from './services/web-socket/web-socket.service';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';
import { ProcessSharedService } from './home/process-scheduler/services/process-shared.service';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    MaterialModule
  ],
  providers: [
    AuthService,
    CacheService,
    AssigneeDropdownCacheService,
    TeamService,
    JiraService,
    DashboardService,
    WebSocketService,
    ProcessSharedService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
