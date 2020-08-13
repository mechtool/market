import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

export const innConditionValidator: ValidatorFn = (fg: FormGroup): ValidationErrors => {
  const inn = fg.get('inn').value;
  const kpp = fg.get('kpp').value;
  if (!inn) {
    return { innCondition: true }
  }
  if (kpp) {
    return inn.toString().length !== 10 ? { innCondition: true } : null;
  }
  if (!kpp) {
    return inn.toString().length !== 12 ? { innCondition: true } : null;
  }
};
