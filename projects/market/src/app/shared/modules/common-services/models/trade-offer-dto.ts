import { AudienceModel } from './audience-model';
import { OfferDeliveryDescriptionModel, TradeOffersModel } from './trade-offers.model';
import { TradeOfferStockEnumModel } from './trade-offer-stock-enum.model';
import { CountryCode } from './location.model';

export class TradeOfferDto {
  id: string;
  description?: string;
  price?: number;
  currencyCode?: string;
  stock?: TradeOfferStockEnumModel;
  amount?: number;
  supplierId?: string;
  supplierName?: string;
  supplierInn?: string;
  audience?: AudienceModel[];
  deliveryRegions?: string[];
  pickupFrom?: string[];
  hasDiscount?: boolean;

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
      supplierInn: offer.supplier?.inn,
      audience: offer.audience,
      deliveryRegions: TradeOfferDto._mapDeliveryRegions(offer.deliveryDescription),
      pickupFrom: TradeOfferDto._mapPickupFrom(offer.deliveryDescription),
      hasDiscount: offer.priceMatrix?.some((matrix) => matrix.priceBeforeDiscount),
    };
  }


  private static _mapDeliveryRegions(deliveryDescription: OfferDeliveryDescriptionModel): string[] {
    if ((!deliveryDescription?.pickupFrom && !deliveryDescription?.deliveryRegions) ||
      deliveryDescription?.deliveryRegions?.some((dr) => dr.countryOksmCode === CountryCode.RUSSIA && !dr.name)) {

      return ['По всей России']
    }

    return deliveryDescription?.deliveryRegions?.map((dr) => dr.name);
  }

  private static _mapPickupFrom(deliveryDescription: OfferDeliveryDescriptionModel): string[] {
    return deliveryDescription?.pickupFrom?.map((pf) => pf.address);
  }
}
