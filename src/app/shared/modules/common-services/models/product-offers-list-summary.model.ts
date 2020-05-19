export class ProductOffersListSummaryModel {
  categories: ProductOffersListCategoryModel[];
  features: ProductOffersListSummaryFeatureModel[];
  tradeMarks: string[];
  suppliers: ProductOffersListSummarySuppliersModel[];
  priceRange: ProductOffersListSummaryPriceRangeModel;
}

export class ProductOffersListCategoryModel {
  id: string;
  name: string;
  productsCount: number;
}


export class ProductOffersListSummaryFeatureModel {
  featureId: string;
  featureName: string;
  numberValues: ProductOffersListSummaryFeatureNumberValuesModel;
  booleanValues: boolean[];
  enumValues: ProductOffersListSummaryFeatureEnumValuesModel[];
}

export class ProductOffersListSummaryFeatureNumberValuesModel {
  min: number;
  max: number;
}

export class ProductOffersListSummaryFeatureEnumValuesModel {
  valueId: string;
  valueName: string;
}

export class ProductOffersListSummarySuppliersModel {
  id: string;
  name: string;
}

export class ProductOffersListSummaryPriceRangeModel {
  min: number;
  max: number;
}
