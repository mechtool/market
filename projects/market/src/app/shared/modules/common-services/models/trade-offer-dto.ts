import { AudienceModel } from './audience-model';
import { TradeOffersModel } from './trade-offers.model';
import { TradeOfferStockEnumModel } from '#shared/modules';

export class TradeOfferDto {
  id: string;
  description?: string;
  price?: number;
  currencyCode?: string;
  stock?: TradeOfferStockEnumModel;
  amount?: number;
  supplierId?: string;
  supplierName?: string;
  audience?: AudienceModel[];

  static fromTradeOffer(offer: TradeOffersModel): TradeOfferDto {
    return {
      id: offer.id,
      description: offer.offerDescription?.title || offer.offerDescription?.description,
      price: offer.price,
      currencyCode: offer.currency?.numericCode,
      stock: offer.stockBalanceSummary?.level,
      amount: offer.stockBalanceSummary?.amount,
      supplierId: offer.supplier?.id,
      supplierName: offer.supplier?.name,
      audience: offer.audience,
    };
  }
}
