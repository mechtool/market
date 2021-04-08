import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { currencyCode } from '#shared/utils';

@Pipe({
  name: 'currencyPrice',
})
export class CurrencyPricePipe implements PipeTransform {

  constructor(private currencyPipe: CurrencyPipe) {
  }

  transform(value: number, currencyNumber: string = '643', display: string = 'symbol', digitsInfo: string = '1.0-4'): string | null {
    return this.currencyPipe.transform(value, currencyCode(currencyNumber), display, digitsInfo);
  }
}
