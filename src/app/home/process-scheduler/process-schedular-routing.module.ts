import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../../shared/guards/role.guard';
import { ProcessSchedularComponent } from './process-schedular.component';


const routes: Routes = [
  {
    path: '',
    component: ProcessSchedularComponent,
    canActivate: [RoleGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [RoleGuard],
  exports: [RouterModule],
})
export class ProcessSchedularRoutingModule {}
