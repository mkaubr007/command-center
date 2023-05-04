import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { InternalErrorComponent } from './internal-error/internal-error.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

const routes: Routes = [
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '500',
    component: InternalErrorComponent,
  },
  {
    path: '403',
    component: ForbiddenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}
