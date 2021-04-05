import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketYesNo',
})
export class YesNoPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Да' : value === false ? 'Нет' : null;
  }
}

