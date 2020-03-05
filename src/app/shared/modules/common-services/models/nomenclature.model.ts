import { NomenclatureFeatureModel } from './nomenclature-feature.model';

export class NomenclatureModel {
  id: number;
  productName: string;
  imageUrls: string[];
  offersSummary: {
    minPrice: number;
    totalOffers: number;
  };

  categoryId?: number;
  categoryName?: string;
  categoryParentsIds?: string[];
  productDescription?: string;
  productPartNumber?: string;
  productBarCodes?: string[];
  features?: NomenclatureFeatureModel[];
  manufacturer?: {
    name: string;
    tradeMark: string;
  };
}
