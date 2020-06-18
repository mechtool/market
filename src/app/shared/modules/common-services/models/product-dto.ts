export class ProductDto {
  id?: string;
  categoryId?: string;
  categoryName?: string;
  categoryAncestorsIds?: string[];
  productName?: string;
  productDescription?: string;
  productPartNumber?: string;
  productBarCodes?: string[];
  features?: ProductFeatureDto[];
  manufacturer?: ProductManufacturerDto;
  images?: ImagesLinkDto[];
}

export class ProductFeatureDto {
  featureId: string;
  featureName: string;
  value?: any;
  valueName?: string;
  valueType: ValueTypeEnum;
}

export class ProductManufacturerDto {
  name?: string;
  tradeMark?: string;
}

export class ImagesLinkDto {
  href: string;
}

export enum ValueTypeEnum {
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  ENUMERATION = 'enumeration',
  STRING = 'string',
  DATE = 'date'
}
