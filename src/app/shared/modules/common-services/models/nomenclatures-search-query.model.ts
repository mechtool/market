export class NomenclaturesSearchQueryModel {
  textQuery?: string;
  categoryId?: string;
  priceFrom?: number;
  priceTo?: number;
  features?: string[];
  suppliers?: string[];
  tradeMarks?: string[];
  onlyInStock?: boolean;
  onlyInSales?: boolean;
  onlyWithImages?: boolean;
  sort?: string;
  page?: number;
  size?: number;
  deliveryLocationFiasCode?: string;
  pickupLocationFiasCode?: string;
}


