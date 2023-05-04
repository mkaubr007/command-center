import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*Modules*/
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../material/material.module';

/*Components*/
import { LoginComponent } from './login/login.component';
import { ForgotPassowrdComponent } from './forgot-passowrd/forgot-passowrd.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedHomeModule } from '../home/shared-home/shared-home.module';
import { BlockUIModule } from 'ng-block-ui';
import { JiraLoginComponent } from './jiralogin/jiralogin.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPassowrdComponent,
    ResetPasswordComponent,
    JiraLoginComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedHomeModule,
    BlockUIModule.forRoot(),
  ],
})
export class AuthModule {}
