import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { validate as isUuid } from 'uuid';

export const cityNotDefinedValidator: ValidatorFn = (formControl: FormControl): ValidationErrors => {
  if (!formControl.parent) {
    return null;
  }
  const cityFiasCode = formControl?.value;
  const fiasCode = formControl.parent.get('fiasCode').value;

  return cityFiasCode && !isUuid(cityFiasCode) && !isUuid(fiasCode) && !isUuid(cityFiasCode) ? { cityNotDefined: true } : null;
}


