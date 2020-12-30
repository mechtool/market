export class FilterFormConfigModel {
  supplier: {
    id: string;
    name: string;
    isSelected: boolean;
  };
  trademark: string;
  isDelivery: boolean;
  isPickup: boolean;
  inStock: boolean;
  withImages: boolean;
  hasDiscount: boolean;
  priceFrom: number;
  priceTo: number;
  location: {
    fias: string;
    name: string;
    isSelected: boolean;
  };
  categorySearchQuery?: string;
  subCategoryId?: string;
  categoryId?: string;
}
