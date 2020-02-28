import { SuggestResponseItemProductModel } from './suggest-response-item-product.model';
import { SuggestResponseItemCategoryModel } from './suggest-response-item-category.model';

export class SuggestResponseModel {
  products: SuggestResponseItemProductModel[];
  categories: SuggestResponseItemCategoryModel[];
}
