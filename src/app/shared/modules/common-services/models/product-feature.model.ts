import { ValueTypeEnum } from './value-type.enum';

export class ProductFeatureModel {
  featureId: string;
  featureName: string;
  value?: any;
  valueName?: string;
  valueType: ValueTypeEnum;
}
