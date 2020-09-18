import { FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const innConditionValidator: ValidatorFn = (formControl: FormControl): ValidationErrors => {
  const inn = formControl.value;
  if (!inn) {
    return { innCondition: true };
  }

  return (inn.toString().length !== 10 && inn.toString().length !== 12) ? { innCondition: true } : null;
};


export const innKppConditionValidator: ValidatorFn = (fg: FormGroup): ValidationErrors => {
  const inn = fg.get('inn').value;
  const kpp = fg.get('kpp').value;
  if (!kpp) {
    return { kppCondition: true };
  }

  return kpp && inn.toString().length !== 10 ? { innKppCondition: true } : null;
};
