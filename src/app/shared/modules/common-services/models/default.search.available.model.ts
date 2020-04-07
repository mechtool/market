export class DefaultSearchAvailableModel {
  supplier?: string; // inn or name
  trademark?: string; // name brand or company
  deliveryMethod?: DeliveryMethod = DeliveryMethod.ANY;
  delivery?: string;
  pickup?: string;
  inStock = true;
  onlyWithImages = true;
  priceFrom?: number;
  priceTo?: number;
}

export enum DeliveryMethod {
  ANY = 'any',
  DELIVERY = 'delivery',
  PICKUP = 'pickup'
}

