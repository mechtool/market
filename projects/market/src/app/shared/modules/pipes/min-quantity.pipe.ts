import { Pipe, PipeTransform } from '@angular/core';
import { TradeOfferPriceMatrixModel } from '#shared/modules/common-services/models/trade-offer-price-matrix.model';

@Pipe({
  name: 'marketMinQuantity',
})
export class MinQuantityPipe implements PipeTransform {
  transform(matrix: TradeOfferPriceMatrixModel[], packageMultiplicity: number): number {
    let multiplicity = 1;
    if (matrix?.length) {
      multiplicity = [...matrix].sort((one, two) => one.fromPackages - two.fromPackages)[0].fromPackages;
    }
    multiplicity = (multiplicity > packageMultiplicity) ? multiplicity : packageMultiplicity;
    return multiplicity;
  }
}
