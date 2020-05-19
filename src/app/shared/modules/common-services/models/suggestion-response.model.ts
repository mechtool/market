import { SuggestionProductItemModel } from './suggestion-product-item.model';
import { SuggestionCategoryItemModel } from './suggestion-category-item.model';
import { SuggestionSearchQueryHistoryModel } from './suggestion-search-query-history.model';

export class SuggestionResponseModel {
  searchQueriesHistory: SuggestionSearchQueryHistoryModel[];
  products?: SuggestionProductItemModel[];
  categories?: SuggestionCategoryItemModel[];
}
