import { ValidatorFn, AbstractControl } from '@angular/forms';
import {IName} from "../../../shared/models/auth/auth";
export default class Utils {
  static emptySpaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      /*number | string --> any*/
      const errors: any = {};
      if (control.value && !control.value.trim()) {
        errors.numbers = true;
        return errors;
      }
      return null;
    };
  }

  static capitalize(str: string): string {
    if (str) {
      return str[0].toUpperCase() + str.substr(1).toLowerCase();
    }
  }

  static removeUnderScore(value: string): string {
    if (value) {
      if (value.includes('_')) {
        return Utils.capitalize(value.replace('_', ' '));
      } else {
        return '';
      }
    }
  }

  /*any --> last is of tyep string[], first -- string*/
  static getFirstAndLastName(fullName: any): { first: string; last: string } {
    let last = fullName.split(' ');
    let first = last.splice(0, 1).join();
    last = last.join(' ');
    return { first, last };
  }

  static getFullName(name: IName): string {
    if (name.first && name.last) {
      return name.first + ' ' + name.last;
    }
    return name.first;
  }

  static OnlyAlphaNumericAndSpace(e: KeyboardEvent): boolean {
    const specialKeys = new Array();
    specialKeys.push(8);  // Backspace
    specialKeys.push(9);  // Tab
    specialKeys.push(46); // Delete
    specialKeys.push(36); // Home
    specialKeys.push(35); // End
    specialKeys.push(37); // Left
    specialKeys.push(39); // Right
    specialKeys.push(32); // space
    const keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
    const isAlphaNueric = ((keyCode >= 48 && keyCode <= 57) ||
      (keyCode >= 65 && keyCode <= 90) ||
      keyCode == 32 ||
      (keyCode >= 97 && keyCode <= 122) ||
      (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
    return isAlphaNueric;
  }

  public static removeHtmlTags(text: string): string {
    return text ? text.replace(/(<([^>]+)>)/ig, '') : '';
  }
}
