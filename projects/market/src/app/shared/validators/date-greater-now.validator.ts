import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";

export function dateGreaterNow(): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (!ctrl.value) {
      return null;
    }
    const ctrlDate = new Date(ctrl.value);
    const currDate = new Date();
    return differenceInCalendarDays(ctrlDate, currDate) >= 0 ? null : { dateGreaterNow: { value: ctrl.value } } ;
  };
}



