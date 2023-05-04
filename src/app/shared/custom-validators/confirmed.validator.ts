import { FormGroup } from '@angular/forms';
import { PasswordValidatorService } from '../../services/password-validator/password-validator.service';

export function ConfirmedValidator(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const passwordValidatorService: PasswordValidatorService = new PasswordValidatorService();
    const matchingControl = formGroup.controls[matchingControlName];
    const isValid = passwordValidatorService.validatePassword(control.value);
    if (matchingControl.errors && !matchingControl.errors.confirmedValidator && control.value == "") {
      return;
    }
    if (!isValid) {
      control.setErrors({ validatePassword: true });
    } else if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
