export class ProductOfferRequestModel {
  priceFrom?: number;
  priceTo?: number;
  suppliers?: string[];
  inStock?: boolean;
  inSales?: boolean;
  country?: string;
  pickupArea?: string;
  deliveryArea?: string;
}
