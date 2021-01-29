import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const notBlankValidator: ValidatorFn = (formControl: FormControl): ValidationErrors => {
  return /^\s+$/.test(formControl.value) ? { blank: true } : null;
}
