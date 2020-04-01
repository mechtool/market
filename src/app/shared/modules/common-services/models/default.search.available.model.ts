export class DefaultSearchAvailableModel {
  supplier?: string; // inn or name
  trademark?: string; // name brand or company
  delivery?: string;
  pickup?: string;
  inStock?: boolean;
  onlyWithImages?: boolean;
  priceFrom?: number;
  priceTo?: number;
}
