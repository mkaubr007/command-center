import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../shared/guards/role.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then(
            (mod) => mod.DashboardModule
          ),
      },
      {
        path: 'team',
        loadChildren: () =>
          import('./team/team.module').then((mod) => mod.TeamModule),
      },
      {
        path: 'process-scheduler',
        loadChildren: () =>
          import('./process-scheduler/process-schedular.module').then((mod) => mod.ProcessSchedularModule),
          canActivate: [RoleGuard],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
