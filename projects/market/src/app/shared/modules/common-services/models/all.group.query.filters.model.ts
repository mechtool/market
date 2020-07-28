import { DefaultSearchAvailableModel } from './default-search-available.model';
import { SortModel } from './sort.model';

export class AllGroupQueryFiltersModel {
  query?: string;
  availableFilters?: DefaultSearchAvailableModel;
  page?: number;
  sort?: SortModel;
}