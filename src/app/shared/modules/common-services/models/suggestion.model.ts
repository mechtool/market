import { SuggestionProductItemModel } from './suggestion-product-item.model';
import { SuggestionCategoryItemModel } from './suggestion-category-item.model';
import { SuggestionSearchQueryHistoryItemModel } from './suggestion-search-query-history-item.model';

export class SuggestionModel {
  searchQueriesHistory: SuggestionSearchQueryHistoryItemModel[];
  products?: SuggestionProductItemModel[];
  categories?: SuggestionCategoryItemModel[];
}
