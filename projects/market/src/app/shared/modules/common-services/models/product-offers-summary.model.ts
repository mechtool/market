export class ProductOffersSummaryModel {
  categories: ProductOffersCategoryModel[];
  features: ProductOffersSummaryFeatureModel[];
  tradeMarks: string[];
  suppliers: ProductOffersSummarySuppliersModel[];
  priceRange: ProductOffersSummaryPriceRangeModel;
}

export class ProductOffersCategoryModel {
  id: string;
  name: string;
  productsCount: number;
}


export class ProductOffersSummaryFeatureModel {
  featureId: string;
  featureName: string;
  numberValues: ProductOffersSummaryFeatureNumberValuesModel;
  booleanValues: boolean[];
  enumValues: ProductOffersSummaryFeatureEnumValuesModel[];
}

export class ProductOffersSummaryFeatureNumberValuesModel {
  min: number;
  max: number;
}

export class ProductOffersSummaryFeatureEnumValuesModel {
  valueId: string;
  valueName: string;
}

export class ProductOffersSummarySuppliersModel {
  id: string;
  name: string;
}

export class ProductOffersSummaryPriceRangeModel {
  min: number;
  max: number;
}
