import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateIsLessThanDate = (dateFromCtrlName: string, dateToCtrlName: string, isRequired = true) => {
  return <ValidatorFn>(ctrl: FormControl): ValidationErrors => {
    if (isRequired && (!ctrl || !ctrl.parent)) {
      return null;
    }
    if (!isRequired && !ctrl?.value) {
      return null;
    }
    // tslint:disable-next-line:max-line-length
    const fromTimeStamp = Date.parse(ctrl.parent?.get(dateFromCtrlName)?.value || ctrl.parent?.parent?.get(dateFromCtrlName)?.value || ctrl.parent?.parent?.parent?.get(dateFromCtrlName)?.value) || null;
    const toTimeStamp = Date.parse(ctrl.value) || null;
    return (toTimeStamp - fromTimeStamp) < 0 ? { [`dateIsLessThanDate__${dateFromCtrlName}_${dateToCtrlName}`]: true } : null;
  }

}
