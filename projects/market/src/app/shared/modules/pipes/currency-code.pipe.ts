import { Pipe, PipeTransform } from '@angular/core';
import { currencyCode } from '#shared/utils';

@Pipe({
  name: 'currencyCode',
})
export class CurrencyCodePipe implements PipeTransform {

  transform(value: string): string | null {
    return currencyCode(value);
  }
}
