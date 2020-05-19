import { ProductFeatureModel } from './product-feature.model';
import { ImagesLinkModel } from './images-link.model';

export class ProductOffersModel {
  product: ProductModel;
  offersMinPrice: number;
  offersTotal: number;
}

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
  manufacturer?: ProductOffersManufacturerModel;
  images?: ImagesLinkModel[];
}

export class ProductOffersManufacturerModel {
  name?: string;
  tradeMark?: string;
}
