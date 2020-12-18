import { Pipe, PipeTransform } from '@angular/core';
import { TradeOfferPriceMatrixModel } from '#shared/modules';

@Pipe({
  name: 'marketMinPrice',
})
export class MinPricePipe implements PipeTransform {
  transform(matrix: TradeOfferPriceMatrixModel[], isBeforeDiscount = false): number {
    if (matrix?.length) {
      return [...matrix]
        .sort((one, two) => one.price - two.price)[0][isBeforeDiscount ? 'priceBeforeDiscount' : 'price'];
    }
    return null;
  }
}
