import { Pipe, PipeTransform } from '@angular/core';
// import * as moment from 'moment';
const moment = require('moment').default || require('moment');

@Pipe({
  name: 'timeTransform',
})
export class TimeTransformPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return moment(value, 'hh:mm').format('hh:mm a');
  }
}
