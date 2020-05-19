export class ProductFeatureModel {
  featureId: string;
  featureName: string;
  value?: any;
  valueName?: string;
  valueType: ValueType;
}

export enum ValueType {
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  ENUMERATION = 'enumeration',
  STRING = 'string',
  DATE = 'date'
}
