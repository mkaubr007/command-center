import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
})
export class InitialsPipe implements PipeTransform {
  transform(fullName: string): string {
    if (fullName) {
      return fullName
        .match(/(\b\S)?/g)
        .join('')
        .match(/(^\S|\S$)?/g)
        .join('')
        .toUpperCase();
    }
    return fullName;
  }
}
