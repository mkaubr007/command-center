import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuard } from '../../shared/guards/route.guard';
import { TeamComponent } from './team.component';

const routes: Routes = [
  {
    path: 'manage',
    component: TeamComponent,
    canActivate: [RouteGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
