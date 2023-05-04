import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordValidatorService {
  private validNewPassword: boolean;
  private requirementsMetCount: number;
  private validMinPasswordLength: boolean;
  private validMaxPasswordLength: boolean;
  private validUpperCaseLetter: boolean;
  private validLowerCaseLetter: boolean;
  private validNumber: boolean;
  private validSpecialCharacter: boolean;
  private validNoRepeatingCharacters: boolean;
  private letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  private numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  private specialCharacters = [
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '_',
    '+',
    '~',
    '-',
    '=',
    '[',
    ']',
    '{',
    '}',
    '|',
    ';',
    ':',
    ',',
    '<',
    '.',
    '>',
    '/',
    '?',
  ];

  constructor() { }

  public validateMinimumLength(password: string, min: number): boolean {
    let valid = false;
    if (password && password.length >= min) {
      valid = true;
    }
    return valid;
  }

  public validateMaximumLength(password: string, max: number): boolean {
    let valid = false;
    if (password && password.length <= max) {
      valid = true;
    }
    return valid;
  }

  public validateUpperCaseLetters(password: string): boolean {
    let valid = false;
    for (let i = 0; i < password.length; i++) {
      if (
        this.letters.includes(password[i]) &&
        password[i] === password[i].toUpperCase()
      ) {
        valid = true;
      }
    }
    return valid;
  }

  public validateLowerCaseLetters(password: string): boolean {
    let valid = false;
    for (let i = 0; i < password.length; i++) {
      if (
        this.letters.includes(password[i]) &&
        password[i] === password[i].toLowerCase()
      ) {
        valid = true;
      }
    }
    return valid;
  }

  public validateNumbers(password: string): boolean {
    let valid = false;
    for (let i = 0; i < password.length; i++) {
      const value = parseInt(password[i]);
      if (this.numbers.includes(value)) {
        valid = true;
      }
    }
    return valid;
  }

  public validateSpecialCharacters(password: string): boolean {
    let valid = false;
    for (let i = 0; i < password.length; i++) {
      const value = password[i];
      if (this.specialCharacters.includes(value)) {
        valid = true;
      }
    }
    return valid;
  }

  public validateRepeatingCharacters(password: string): boolean {
    let valid = false;
    const repeats = /(.)\1{2}/;
    valid = !repeats.test(password);
    return valid;
  }

  public validatePassword(newPassword: string): boolean {
    if (newPassword) {
      this.reset();
      this.validatePasswordRequirements(newPassword);
      this.getValidCount();
      this.getOverallValidity();
      return this.validNewPassword;
    } else {
      return false;
    }
  }

  private validatePasswordRequirements(newPassword: string): void {
    this.validMaxPasswordLength = this.validateMaximumLength(newPassword, 128);
    this.validMinPasswordLength = this.validateMinimumLength(newPassword, 10);
    this.validUpperCaseLetter = this.validateUpperCaseLetters(newPassword);
    this.validLowerCaseLetter = this.validateLowerCaseLetters(newPassword);
    this.validNumber = this.validateNumbers(newPassword);
    this.validSpecialCharacter = this.validateSpecialCharacters(newPassword);
    this.validNoRepeatingCharacters = this.validateRepeatingCharacters(newPassword);
  }

  private reset(): void {
    this.validNewPassword = false;
    this.requirementsMetCount = 0;
    this.validMinPasswordLength = false;
    this.validMaxPasswordLength = false;
    this.validUpperCaseLetter = false;
    this.validLowerCaseLetter = false;
    this.validNumber = false;
    this.validSpecialCharacter = false;
    this.validNoRepeatingCharacters = false;
  }

  private getValidCount(): void {
    this.requirementsMetCount = this.validUpperCaseLetter
      ? this.requirementsMetCount + 1
      : null;
    this.requirementsMetCount = this.validLowerCaseLetter
      ? this.requirementsMetCount + 1
      : null;
    this.requirementsMetCount = this.validNumber
      ? this.requirementsMetCount + 1
      : null;
    this.requirementsMetCount = this.validSpecialCharacter
      ? this.requirementsMetCount + 1
      : null;
  }

  private getOverallValidity(): void {
    this.validNewPassword =
      this.validMinPasswordLength &&
        this.validMaxPasswordLength &&
        this.requirementsMetCount >= 4 &&
        this.validNoRepeatingCharacters
        ? true
        : false;
  }
}
