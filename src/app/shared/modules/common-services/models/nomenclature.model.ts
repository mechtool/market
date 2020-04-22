import { NomenclatureFeatureModel } from './nomenclature-feature.model';

export class NomenclatureModel {
  id: string;
  productName: string;
  imageUrls: string[];
  offersSummary: {
    minPrice: number;
    totalOffers: number;
  };

  categoryId?: string;
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
