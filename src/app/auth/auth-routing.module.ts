import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPassowrdComponent } from './forgot-passowrd/forgot-passowrd.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { JiraLoginComponent } from './jiralogin/jiralogin.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot_password',
    component: ForgotPassowrdComponent,
  },
  {
    path: 'reset_password',
    component: ResetPasswordComponent,
  },
  {
    path: 'jira_login',
    component: JiraLoginComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}