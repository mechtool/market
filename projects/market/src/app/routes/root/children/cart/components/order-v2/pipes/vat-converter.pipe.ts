import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe, PercentPipe } from '@angular/common';

const VATS = {
  VAT_10: 10,
  VAT_20: 20,
  VAT_WITHOUT: 0,
};

@Pipe({
  name: 'marketVatConverter',
})
export class VatConverterPipe implements PipeTransform {

  constructor(private percentPipe: PercentPipe) {
  }

  transform(value: 'VAT_10' | 'VAT_20' | 'VAT_WITHOUT', includesVAT: boolean): string {
    if (value === 'VAT_WITHOUT') {
      return 'без НДС';
    }
    const percent = this.percentPipe.transform((VATS[value] || 0) / 100);
    return includesVAT ? `включая НДС ${percent}` : `без НДС ${percent}`;
  }
}

