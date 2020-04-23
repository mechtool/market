export class NomenclatureFeatureModel {
  featureId: string;
  featureName: string;
  value?: string;
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
