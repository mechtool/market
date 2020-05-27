import { TradeOfferStockEnumModel } from './trade-offer-stock-enum.model';

export class TradeOfferResponseModel {
  id: string;
  externalCode: string;
  offerDescription: TradeOfferDescriptionModel;
  product: TradeOfferProductModel;
  supplier: TradeOfferSupplierModel;
  termsOfSale: TradeOfferTermsOfSaleModel;
  stock: TradeOfferSockModel;
  deliveryDescription: TradeOfferDeliveryDescriptionModel;
  requestedPriceProjection: TradeOfferRequestedPriceProjectionModel;
}

export class TradeOfferDescriptionModel {
  title: string;
  description: string;
}

export class TradeOfferProductModel {
  ref1cNomenclature: TradeOfferRef1cNomenclatureModel;
  supplierNomenclature: TradeOfferSupplierNomenclature;
}

export class TradeOfferRef1cNomenclatureModel {
  categoryId: string;
  categoryName: string;
  parentCategories: TradeOfferParentCategoriesModel[];
  productSpecificationId: string;
  productName: string;
  productDescription: string;
  productCharacteristicId: string;
  productCharacteristicName: string;
  productBarCodes: string[];
  productPartNumber: string;
  imageUrls: string[];
  baseUnitOkeiCode: string;
  manufacturer: {
    id: string;
    name: string;
    tradeMarkId: string;
    tradeMark: string;
  };
  requisites: TradeOffer1cRequisitesModel[];
}

export class TradeOfferSupplierNomenclature {
  productSpecificationId: string;
  productName: string;
  productDescription: string;
  manufacturer: {
    tradeMark: string;
    name: string;
  };
  productPartNumber: string;
  productBarCodes: string[];
  baseUnitOkeiCode: string;
  requisites: TradeOffer1SnRequisitesModel[];
  imageUrls: string[];
  ref1Cn: {
    categoryId: string;
    categoryName: string;
    parentCategories: TradeOfferParentCategoriesModel[];
    requisites: TradeOffer1cRequisitesModel[];
  };
}

export class TradeOffer1cRequisitesModel {
  id: string;
  name: string;
  value: any;
  valueName: string;
  valueType: string;
}

export class TradeOffer1SnRequisitesModel {
  name: string;
  value: any;
}

export class TradeOfferSupplierModel {
  bnetInternalId: string;
  inn: string;
  kpp: string;
  name: string;
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
}

export class TradeOfferSockModel {
  stockBalanceSummary: {
    level: TradeOfferStockEnumModel;
  };
}

export class TradeOfferTermsOfSaleModel {
  packaging: {
    description: string;
    unitsNumerator: number;
    unitsDenominator: number;
  };
  maxDaysForShipment: number;
  price: {
    currencyCode: string;
    vat: TradeOfferVatEnumModel;
    includesVAT: boolean;
    matrix: TradeOfferPriceMatrixModel[];
  };
  orderRestrictions: {
    sum: {
      minimum: number;
      includesVAT: boolean;
    }
  };
  packageMultiplicity: number;
  temporarilyOutOfSales: boolean;

}

export class TradeOfferDeliveryDescriptionModel {
  deliveryRegions: TradeOfferDeliveryRegionsModel[];
  pickupFrom: TradeOfferPickupFromModel[];
}

export class TradeOfferDeliveryRegionsModel {
  fiasCodes: string[];
  name: string;
  countryOksmCode: string;
}

export class TradeOfferPickupFromModel {
  fiasCodes: string[];
  address: string;
  countryOksmCode: string;
}

export class TradeOfferRequestedPriceProjectionModel {
  requestedCurrencyCode: string;
  matrix: TradeOfferPriceMatrixModel[];
}

export class TradeOfferPriceMatrixModel {
  fromPackages: number;
  price: number;
  description: string;
}

export class TradeOfferParentCategoriesModel {
  categoryId: string;
  categoryName: string;
}

export enum TradeOfferVatEnumModel {
  VAT_10 = 'VAT_10',
  VAT_20 = 'VAT_20',
  VAT_WITHOUT = 'VAT_WITHOUT',
}
