import { Pipe, PipeTransform } from '@angular/core';
import { TradeOfferStockEnumModel } from '#shared/modules/common-services/models';

@Pipe({
  name: 'marketStock',
})
export class StockPipe implements PipeTransform {
  transform(amount: number, level: TradeOfferStockEnumModel, temporarilyOutOfSales?: boolean): string {

    if (temporarilyOutOfSales) {
      return 'снят с продажи';
    }

    if (amount === 0) {
      return 'нет на складе';
    }

    if (amount && level) {
      return `${amount} (${mapStock(level)})`;
    }

    if (amount) {
      return `${amount}`;
    }

    if (level) {
      return mapStock(level);
    }

    return null;
  }
}

function mapStock(stock: TradeOfferStockEnumModel): string {
  switch (stock) {
    case TradeOfferStockEnumModel.HIGH:
      return 'много';
    case TradeOfferStockEnumModel.MEDIUM:
      return 'умеренно';
    case TradeOfferStockEnumModel.LOW:
      return 'мало';
    case TradeOfferStockEnumModel.OUT_OF_STOCK:
      return 'нет на складе';
    default:
      return null;
  }
}
