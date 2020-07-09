import { TradeOffersModel } from './trade-offers.model';
import { mapStock } from '#shared/utils';
import { AudienceModel } from '#shared/modules/common-services/models/audience-model';

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
      description: 'Описание специальных условия от поставщика, которые у него находятся в специальной вкладке' +
        ' и выводится первые четыре строки этой инфы', // todo пока негде взять!!!
      price: offer.price,
      stock: mapStock(offer.stock),
      supplierId: offer.supplier.id,
      supplierName: offer.supplier.name,
      audience: offer.audience,
    };
  }
}
