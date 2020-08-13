import { DefaultSearchAvailableModel } from './default-search-available.model';
import { SortModel } from './sort.model';

export class AllGroupQueryFiltersModel {
  query?: string;
  filters?: DefaultSearchAvailableModel;
  page?: number;
  sort?: SortModel;
}
