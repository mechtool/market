import { DeliveryMethod } from './delivery-method-enum.model';

export class DefaultSearchAvailableModel {
  supplier?: string;
  trademark?: string; // name brand or company
  deliveryMethod?: DeliveryMethod;
  delivery?: string;
  pickup?: string;
  inStock?: boolean;
  withImages?: boolean;
  priceFrom?: number;
  priceTo?: number;
}
