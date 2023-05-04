import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { InternalErrorComponent } from './internal-error/internal-error.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

@NgModule({
  declarations: [InternalErrorComponent, NotFoundComponent, ForbiddenComponent],
  imports: [CommonModule, ErrorRoutingModule],
})
export class ErrorModule {}
