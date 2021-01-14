import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

@Pipe({
  name: 'marketCastControl',
})
export class CastControlPipe implements PipeTransform {
  transform(value: AbstractControl, name: string): FormGroup[] {
    if (value) {
      return ((value as FormGroup).controls[name] as FormArray).controls as FormGroup[];
    }
    return [];
  }
}
