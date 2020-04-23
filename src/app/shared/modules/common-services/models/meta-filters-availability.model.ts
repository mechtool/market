export class MetaFiltersAvailabilityModel {
  features: MetaFiltersAvailabilityFeatureModel[];
  tradeMarks: string[];
  suppliers: MetaFiltersAvailabilitySuppliersModel[];
  priceRange: MetaFiltersAvailabilityPriceRangeModel;
}

export class MetaFiltersAvailabilityFeatureModel {
  featureId: string;
  featureName: string;
  numberValues: MetaFiltersAvailabilityFeatureNumberValuesModel;
  booleanValues: boolean[];
  enumValues: MetaFiltersAvailabilityFeatureEnumValuesModel[];
}

export class MetaFiltersAvailabilityFeatureNumberValuesModel {
  min: number;
  max: number;
}

export class MetaFiltersAvailabilityFeatureEnumValuesModel {
  valueId: string;
  valueName: string;
}

export class MetaFiltersAvailabilitySuppliersModel {
  id: string;
  name: string;
}

export class MetaFiltersAvailabilityPriceRangeModel {
  min: number;
  max: number;
}




