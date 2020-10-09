import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const supplierNameConditionValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors => {
  const isSelected = formGroup.get('isSelected').value;
  const supplierName = formGroup.get('name').value;
  return !isSelected && supplierName?.length ? { supplierNameCondition: true } : null;
};

export const locationNameConditionValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors => {
  const isSelected = formGroup.get('isSelected').value;
  const locationName = formGroup.get('name').value;
  return !isSelected && locationName?.length ? { locationNameCondition: true } : null;
};

export const priceConditionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors => {
  const price = +control.value;
  return price < 0 ? { priceFromCondition: true } : null;
};

export const priceRangeConditionValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors => {
  const priceFrom = formGroup.get('priceFrom').value;
  const priceTo = formGroup.get('priceTo').value;
  return priceFrom && priceTo && priceFrom >= priceTo ? { priceRangeCondition: true } : null;
};
