import { TradeOfferStockEnumModel } from './trade-offer-stock-enum.model';
import { AudienceModel } from './audience-model';
import { TradeOfferDescriptionModel } from './trade-offer-description.model';

export class TradeOffersModel {
  id: string;
  price: number;
  stock: TradeOfferStockEnumModel;
  supplier: TradeOffersSupplierModel;
  orderPlacingReference: string;
  offerDescription: TradeOfferDescriptionModel;
  audience: AudienceModel[];
}

export class TradeOffersSupplierModel {
  id: string;
  name: string;
  legalId: string;
  inn: string;
  kpp: string;
}
