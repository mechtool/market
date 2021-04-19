import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const notBlankValidator: ValidatorFn = (formControl: FormControl): ValidationErrors => {
  return /^\s+$/.test(formControl.value) ? { blank: true } : null;
}

export const minDateValidator: ValidatorFn = (formControl: FormControl): ValidationErrors => {
  return formControl.value && new Date(formControl.value).toISOString().substr(0, 10) < new Date().toISOString().substr(0, 10) ? { minDate: new Date().toLocaleDateString() } : null;
}


