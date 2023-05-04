import { TestBed } from '@angular/core/testing';
import { PasswordValidatorConstants } from './password-validator.constants';

import { PasswordValidatorService } from './password-validator.service';

describe('PasswordValidatorService', () => {
  let passwordValidatorService: PasswordValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    passwordValidatorService = TestBed.inject(PasswordValidatorService);
  });

  it('should be created', () => {
    expect(passwordValidatorService).toBeTruthy();
  });

  it('should validate maximum length' ,() => {
    const result = passwordValidatorService.validateMaximumLength(PasswordValidatorConstants.PASSWORD, PasswordValidatorConstants.MAXIMUM_PASSWORD_LENGTH);
    expect(result).toBeTruthy();
});

it('should validate minimum length', () => {
    const result = passwordValidatorService.validateMinimumLength(PasswordValidatorConstants.PASSWORD, PasswordValidatorConstants.MINIMUM_PASSWORD_LENGTH);
    expect(result).toBeTruthy();
});

it('should validate upper case letters', () => {
    const result = passwordValidatorService.validateUpperCaseLetters(PasswordValidatorConstants.PASSWORD);
    expect(result).toBeTruthy();
});

it('should validate lower case letters', () => {
    const result = passwordValidatorService.validateLowerCaseLetters(PasswordValidatorConstants.PASSWORD);
    expect(result).toBeTruthy();
});

it('should validate numbers', () => {
    const result = passwordValidatorService.validateNumbers(PasswordValidatorConstants.PASSWORD);
    expect(result).toBeTruthy();
});

it('should validate special characters', () => {
    const result = passwordValidatorService.validateSpecialCharacters(PasswordValidatorConstants.PASSWORD);
    expect(result).toBeTruthy();
});

it('should validate repeating characters', () => {
    const result = passwordValidatorService.validateRepeatingCharacters(PasswordValidatorConstants.PASSWORD);
    expect(result).toBeTruthy();
});

it('should validate password', () => {
    const resetSpy = jest.spyOn<any, any>(passwordValidatorService, "reset");
    const validatePasswordRequirementsSpy = jest.spyOn<any, any>(passwordValidatorService, "validatePasswordRequirements");
    const getValidCountSpy = jest.spyOn<any, any>(passwordValidatorService, "getValidCount");
    const getOverallValiditySpy = jest.spyOn<any, any>(passwordValidatorService, "getOverallValidity");

    const result = passwordValidatorService.validatePassword(PasswordValidatorConstants.PASSWORD);

    expect(resetSpy).toHaveBeenCalled();
    expect(validatePasswordRequirementsSpy).toHaveBeenCalled();
    expect(getValidCountSpy).toHaveBeenCalled();
    expect(getOverallValiditySpy).toHaveBeenCalled();
    expect(result).toBeTruthy();
});

it('should validate password requirements', () => {
    passwordValidatorService["validatePasswordRequirements"](PasswordValidatorConstants.PASSWORD);

    expect(passwordValidatorService["validMaxPasswordLength"]).toBeTruthy();
    expect(passwordValidatorService["validMinPasswordLength"]).toBeTruthy();
    expect(passwordValidatorService["validUpperCaseLetter"]).toBeTruthy();
    expect(passwordValidatorService["validLowerCaseLetter"]).toBeTruthy();
    expect(passwordValidatorService["validNumber"]).toBeTruthy();
    expect(passwordValidatorService["validSpecialCharacter"]).toBeTruthy();
    expect(passwordValidatorService["validNoRepeatingCharacters"]).toBeTruthy()
});

it('should reset all flags', () => {
    passwordValidatorService["reset"]();

    expect(passwordValidatorService["validNewPassword"]).toBeFalsy();
    expect(passwordValidatorService["requirementsMetCount"]).toBe(0);
    expect(passwordValidatorService["validMinPasswordLength"]).toBeFalsy();
    expect(passwordValidatorService["validMaxPasswordLength"]).toBeFalsy();
    expect(passwordValidatorService["validUpperCaseLetter"]).toBeFalsy();
    expect(passwordValidatorService["validLowerCaseLetter"]).toBeFalsy();
    expect(passwordValidatorService["validNumber"]).toBeFalsy();
    expect(passwordValidatorService["validSpecialCharacter"]).toBeFalsy();
    expect(passwordValidatorService["validNoRepeatingCharcters"]).toBeFalsy();
});

it('should get valid count', () => {
    passwordValidatorService["validUpperCaseLetter"] = true;
    passwordValidatorService["validLowerCaseLetter"] = true;
    passwordValidatorService["validNumber"] = true;
    passwordValidatorService["validSpecialCharacter"] = true;
    passwordValidatorService["requirementsMetCount"] = 0;

    passwordValidatorService["getValidCount"]();
    expect(passwordValidatorService["requirementsMetCount"]).toBe(4);
});

it('should get overall validity', () => {
    passwordValidatorService["validMinPasswordLength"] = true;
    passwordValidatorService["validMaxPasswordLength"] = true;
    passwordValidatorService["requirementsMetCount"] = 4;
    passwordValidatorService["validNoRepeatingCharacters"] = true;

    passwordValidatorService["getOverallValidity"]();

    expect(passwordValidatorService["validNewPassword"]).toBeTruthy();
});
});
