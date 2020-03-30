export class DefaultSearchAvailableModel {
  supplier?: string; // inn or name
  trademark?: string; // name brand or company
  delivery?: boolean;
  pickup?: boolean;
  inStock?: boolean;
  onlyWithImages?: boolean;
  priceFrom?: number;
  priceTo?: number;
}
