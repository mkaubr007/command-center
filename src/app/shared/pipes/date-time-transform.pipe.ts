import { Pipe, PipeTransform } from '@angular/core';
const moment = require('moment').default || require('moment');
@Pipe({
  name: 'dateTimeTransform',
})
export class DateTimeTransform implements PipeTransform {
  transform(value:any) {

    const dateFormat = {
      hour: '2-digit',
      minute: '2-digit'
    };

    if (Array.isArray(value)) {
      const startDate = moment(value[0]).format('MM/DD/YYYY');
      let timestamp = startDate;
      const firstTime = new Date(value[0]).toLocaleTimeString('en-US', dateFormat);
      const endDate = value.length > 1 ? moment(value[value.length - 1]).format('MM/DD/YYYY') : undefined;

      if (endDate) {
        const lastTime = new Date(value[value.length - 1]).toLocaleTimeString('en-US', dateFormat);

        if (startDate !== endDate) {
          timestamp += ` ${firstTime} - ${endDate} ${lastTime}`;
        } else {
          timestamp += `<span class="at"> between </span> </br> ${firstTime} - ${lastTime}`;
        }
      } else {
        timestamp += `<span class="at"> at </span> ${firstTime}`;
      }
      return timestamp;
    } else {
      const date = moment(value).format('MM/DD/YYYY');
      const time = new Date(value).toLocaleTimeString('en-US', dateFormat);
      return `${date} <span class="at"> at </span> ${time}`;
    }
  }


}
