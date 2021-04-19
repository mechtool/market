export class CategoriesMappingModel {
  mapping: CategoriesMappingModelRow[];
}

export class CategoriesMappingModelRow {
  externalCategoryName: string;
  ref1CnCategoryId: string;
  ref1CnCategoryName?: string;
}
