import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { TimeTransformPipe } from './pipes/time-transform.pipe';
import { DateTransformPipe } from './pipes/date-transform.pipe';
import { SharedService } from './shared.service';
import {DateTimeTransform } from './pipes/date-time-transform.pipe';
import { InitialsPipe } from './pipes/initials.pipe';
import { FirstAndLastNamePipe } from './pipes/first-and-last-name.pipe';

@NgModule({
  declarations: [EllipsisPipe, TimeTransformPipe, DateTransformPipe,DateTimeTransform, InitialsPipe, FirstAndLastNamePipe],
  imports: [CommonModule],
  exports: [EllipsisPipe, TimeTransformPipe, DateTransformPipe,DateTimeTransform, InitialsPipe, FirstAndLastNamePipe],
  providers: [SharedService],
})
export class SharedModule {}
