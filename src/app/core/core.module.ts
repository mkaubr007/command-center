import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomHttpService } from './services/http.service';
import { LocalStorageService } from './services/local-storage.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RightService } from '../shared/services/right.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    CustomHttpService,
    LocalStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    RightService

  ]
})
export class CoreModule { }
