import { NomenclatureFeatureModel } from './nomenclature-feature.model';

export class NomenclatureModel {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryParentsIds?: string[];
  productName: string;
  productDescription?: string;
  productPartNumber?: string;
  productBarCodes?: string[];
  features?: NomenclatureFeatureModel[];
  manufacturer?: NomenclatureManufacturerModel;
  imageUrls?: string[];
  offersSummary?: NomenclatureOffersSummaryModel;
}

export class NomenclatureManufacturerModel {
  name?: string;
  tradeMark?: string;
}

export class NomenclatureOffersSummaryModel {
  minPrice: number;
  totalOffers: number;
}
