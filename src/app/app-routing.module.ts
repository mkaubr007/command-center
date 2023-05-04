import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(mod => mod.AuthModule),
  },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(mod => mod.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'error',
    loadChildren: () => import('./error-pages/error.module').then(mod => mod.ErrorModule),
  },
  // {
  //   path: '**',
  //   redirectTo: 'login',
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule],
})
export class AppRoutingModule { }
