import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// todo вынести валидаторы ИНН, КПП в отдельный файл от сюда и из других мест в shared директорию и импортировать во всех местах

const checkInnValidity = (i): boolean => {
  if (i.match(/\D/)) {
    return false;
  }

  const inn = i.match(/(\d)/g);

  if (inn.length === 10) {
    return (
      inn[9] ===
      String(
        ((2 * inn[0] + 4 * inn[1] + 10 * inn[2] + 3 * inn[3] + 5 * inn[4] + 9 * inn[5] + 4 * inn[6] + 6 * inn[7] + 8 * inn[8]) % 11) % 10,
      )
    );
  }
  if (inn.length === 12) {
    return (
      inn[10] ===
      String(
        ((7 * inn[0] +
          2 * inn[1] +
          4 * inn[2] +
          10 * inn[3] +
          3 * inn[4] +
          5 * inn[5] +
          9 * inn[6] +
          4 * inn[7] +
          6 * inn[8] +
          8 * inn[9]) %
          11) %
        10,
      ) &&
      inn[11] ===
      String(
        ((3 * inn[0] +
          7 * inn[1] +
          2 * inn[2] +
          4 * inn[3] +
          10 * inn[4] +
          3 * inn[5] +
          5 * inn[6] +
          9 * inn[7] +
          4 * inn[8] +
          6 * inn[9] +
          8 * inn[10]) %
          11) %
        10,
      )
    );
  }

  return false;
};

export const innConditionValidator: ValidatorFn = (formControl: FormControl): ValidationErrors => {
  const inn = formControl.value;
  if (!inn) {
    return { innCondition: true };
  }

  if (inn.length !== 10 && inn.length !== 12) {
    return { innLengthCondition: true };
  }

  return checkInnValidity(inn.toString()) ? null : { innControlNumberCondition: true };
};

export const kppConditionValidator: ValidatorFn = (formControl: FormControl): ValidationErrors => {
  const kpp = formControl.value;
  return kpp && kpp.length !== 9 ? { kppLengthCondition: true } : null;
}

export const kppRequiredIfOrgConditionValidator: ValidatorFn = (formControl: FormControl): ValidationErrors => {
  const inn = formControl?.parent?.get('consumerInn').value;
  const kpp = formControl.value;
  return inn?.length === 10 && !kpp ? { kppRequiredCondition: true } : null;
}
