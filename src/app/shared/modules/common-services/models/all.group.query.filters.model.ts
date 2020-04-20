import { DefaultSearchAvailableModel } from './default-search-available.model';
import { SortModel } from './sort.model';

export class AllGroupQueryFiltersModel {
  query?: string;
  categoryId?: string;
  availableFilters?: DefaultSearchAvailableModel;
  sort?: SortModel;
}
