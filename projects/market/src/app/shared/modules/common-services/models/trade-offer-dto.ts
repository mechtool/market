import { AudienceModel } from './audience-model';
import { TradeOffersModel } from './trade-offers.model';
import { mapStock } from '#shared/utils';

export class TradeOfferDto {
  id: string;
  description?: string;
  price?: number;
  stock?: string; // todo: Должно быть number, но пока в апи такого нет
  supplierId?: string;
  supplierName?: string;
  audience?: AudienceModel[];

  static fromTradeOffer(offer: TradeOffersModel): TradeOfferDto {
    return {
      id: offer.id,
      description: offer.offerDescription?.title,
      price: offer.price,
      stock: mapStock(offer.stock),
      supplierId: offer.supplier.id,
      supplierName: offer.supplier.name,
      audience: offer.audience,
    };
  }
}
