import { Pipe, PipeTransform } from '@angular/core';
import { TradeOfferPriceMatrixModel } from '#shared/modules/common-services/models/trade-offer-price-matrix.model';

@Pipe({
  name: 'marketMinQuantity',
})
export class MinQuantityPipe implements PipeTransform {
  transform(matrix: TradeOfferPriceMatrixModel[], packageMultiplicity: number): number {
    let multiplicity = 1;
    if (matrix?.length > 1) {
      multiplicity = [...matrix].sort((one, two) => one.fromPackages - two.fromPackages)[0].fromPackages;
    } else {
      // tslint:disable-next-line:max-line-length
      multiplicity = (matrix?.length === 1 && matrix?.[0].fromPackages > packageMultiplicity) ? matrix?.[0].fromPackages : packageMultiplicity;
    }
    return multiplicity;
  }
}
