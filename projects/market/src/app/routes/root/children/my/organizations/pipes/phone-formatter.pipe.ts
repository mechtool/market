import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketPhoneFormatter',
})
export class PhoneFormattersPipe implements PipeTransform {
  transform(value: string): string {
    const modifiedValue = value.replace(/[^0-9]/g, '');
    if (modifiedValue.length === 11 && modifiedValue[0] === '7') {
      return `+${modifiedValue}`;
    }
    if (modifiedValue.length === 11 && modifiedValue[0] !== '7') {
      return modifiedValue;
    }
    if (modifiedValue.length === 10) {
      return `+7${modifiedValue}`;
    }
    return modifiedValue;
  }
}

