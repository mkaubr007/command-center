import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateTransform',
})
export class DateTransformPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.datePipe.transform(value, 'EEE, MMM dd, yyyy');
  }
}
