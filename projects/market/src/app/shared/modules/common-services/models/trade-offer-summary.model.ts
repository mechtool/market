import { TradeOfferVatEnumModel } from './trade-offer-vat-enum.model';
import { TradeOfferPriceMatrixModel } from './trade-offer-price-matrix.model';
import { TradeOfferPackagingModel } from './trade-offer-packaging.model';
import { TradeOfferSockModel } from './trade-offer-sock.model';
import { TradeOfferSupplierModel } from './trade-offer-supplier.model';
import { AudienceModel } from './audience-model';

export class TradeOfferSummaryModel {
  id: string;
  productName: string;
  offerTitle: string;
  ref1cNomenclatureCategoryId: string;
  ref1cNomenclatureCategoryName: string;
  baseUnitOkeiCode: string;
  productPartNumber: string;
  supplierPartNumber: string;
  maxDaysForShipment: number;
  packageMultiplicity: number;
  packaging: TradeOfferPackagingModel;
  price: TradeOfferSummaryPriceModel;
  stock: TradeOfferSockModel;
  temporarilyOutOfSales: boolean;
  priceProjection: TradeOfferSummaryPriceProjectionModel;
  ref1cNomenclatureSpecificationId: string;
  ref1cNomenclatureCharacteristicId: string;
  supplierNomenclatureSpecificationId: string;
  barCodes: string[];
  audience: AudienceModel[];
  supplier: TradeOfferSupplierModel;
  imageUrls: string[];
}

export class TradeOfferSummaryPriceModel {
  currencyCode: string;
  vat: TradeOfferVatEnumModel;
  includesVAT: boolean;
  hasDiscount: boolean;
  matrix: TradeOfferPriceMatrixModel[];
}

export class TradeOfferSummaryPriceProjectionModel {
  requestedCurrencyCode: string;
  price: number;
}
