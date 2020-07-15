import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const supplierNameConditionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors => {
  const supplier = control.value;
  return typeof supplier === 'string' && supplier.length ? { supplierNameCondition: true } : null;
};

export const priceConditionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors => {
  const price = +control.value;
  return price < 0 ? { priceFromCondition: true } : null;
};

export const priceRangeConditionValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors => {
  const priceFrom = formGroup.get('priceFrom').value;
  const priceTo = formGroup.get('priceTo').value;
  return priceFrom && priceTo && priceTo < priceFrom ? { priceRangeCondition: true } : null;
};
