import { TradeOfferStockEnumModel } from '#shared/modules/common-services/models/trade-offer-stock-enum.model';

export class TradeOffersModel {
  id: string;
  price: number;
  stock: TradeOfferStockEnumModel;
  supplier: TradeOffersSupplierModel;
  orderPlacingReference: string;
  targetedOffer: boolean;
}

export class TradeOffersSupplierModel {
  id: string;
  name: string;
  legalId: string;
  inn: string;
  kpp: string;
}
