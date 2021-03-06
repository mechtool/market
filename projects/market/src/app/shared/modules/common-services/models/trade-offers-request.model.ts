export class TradeOffersRequestModel {
  public q?: string;
  public tradeMark?: string;
  public priceFrom?: number;
  public priceTo?: number;
  public inSales?: boolean;
  public inStock?: boolean;
  public withImages?: boolean;
  public supplierInn?: string;
  public deliveryArea?: string;
  public pickupArea?: string;
  public categoryId?: string;
  public sort?: string;
  public page?: number;
  public size?: number;
}
