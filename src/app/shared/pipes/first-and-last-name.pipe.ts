import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstAndLastName',
})
export class FirstAndLastNamePipe implements PipeTransform {
  transform(fullName: string, last?: boolean): string {
    if (last) {
      return fullName.split(' ').slice(-1).join(' ');
    } else {
      return fullName.split(' ').slice(0, -1).join(' ');
    }
  }
}
