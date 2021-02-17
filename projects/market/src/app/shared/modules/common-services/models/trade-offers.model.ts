import { TradeOfferStockEnumModel } from './trade-offer-stock-enum.model';
import { AudienceModel } from './audience-model';
import { TradeOfferDescriptionModel } from './trade-offer-description.model';
import { TradeOfferVatEnumModel } from './trade-offer-vat-enum.model';
import { TradeOfferPriceMatrixModel } from './trade-offer-price-matrix.model';

export class TradeOffersModel {
  id: string;
  price: number;
  currency: {
    numericCode: string;
    code: string;
  };
  vat: TradeOfferVatEnumModel;
  includesVAT: boolean;
  priceMatrix: TradeOfferPriceMatrixModel[];
  stockBalanceSummary: {
    level: TradeOfferStockEnumModel;
    amount: number;
  };
  stock: TradeOfferStockEnumModel;
  supplier: TradeOffersSupplierModel;
  orderPlacingReference: string;
  offerDescription: TradeOfferDescriptionModel;
  audience: AudienceModel[];
  deliveryDescription: OfferDeliveryDescriptionModel;
}

export class TradeOffersSupplierModel {
  id: string;
  name: string;
  legalId: string;
  inn: string;
  kpp: string;
}

export class OfferDeliveryDescriptionModel {
  deliveryRegions: OfferDeliveryRegionsModel[];
  pickupFrom: OfferPickupFromModel[];
}

export class OfferDeliveryRegionsModel {
  name: string;
  countryOksmCode: string;
}

export class OfferPickupFromModel {
  address: string;
  countryOksmCode: string;
}
