export class ProductOffersRequestModel {
  public q?: string;
  public categoryId?: string;
  public priceFrom?: number;
  public priceTo?: number;
  public features?: string[];
  public suppliers?: string[];
  public tradeMarks?: string[];
  public inStock?: boolean;
  public inSales?: boolean;
  public onlyWithImages?: boolean;
  public country?: string;
  public deliveryArea?: string;
  public pickupArea?: string;
  public sort?: string;
  public page?: number;
  public size?: number;
}


