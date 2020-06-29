import { TradeOfferStockEnumModel } from '#shared/modules/common-services/models/trade-offer-stock-enum.model';
import { AudienceModel } from './audience-model';

export class TradeOffersModel {
  id: string;
  price: number;
  stock: TradeOfferStockEnumModel;
  supplier: TradeOffersSupplierModel;
  orderPlacingReference: string;
  audience: AudienceModel[];
}

export class TradeOffersSupplierModel {
  id: string;
  name: string;
  legalId: string;
  inn: string;
  kpp: string;
}
