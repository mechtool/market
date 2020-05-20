import { ProductFeatureModel } from './product-feature.model';
import { ImagesLinkModel } from './images-link.model';

export class ProductModel {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryAncestorsIds?: string[];
  productName: string;
  productDescription?: string;
  productPartNumber?: string;
  productBarCodes?: string[];
  features?: ProductFeatureModel[];
  manufacturer?: ProductManufacturerModel;
  images?: ImagesLinkModel[];
}

export class ProductManufacturerModel {
  name?: string;
  tradeMark?: string;
}
