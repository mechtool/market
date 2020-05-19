export class SuggestionSearchQueryHistoryModel {
  id?: number;
  searchText: string;
  imageUrl?: string;
  typeOfSearch: TypeOfSearch;
}

export enum TypeOfSearch {
  PRODUCT = 'Продукт',
  CATEGORY = 'Категория',
  SEARCH = 'Запрос'
}
