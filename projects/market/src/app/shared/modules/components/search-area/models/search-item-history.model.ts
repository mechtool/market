export class SearchItemHistoryModel {
  id: string;
  searchText: string;
  imageUrl: string;
  typeOfSearch?: TypeOfSearch;
}

enum TypeOfSearch {
  PRODUCT = 'Продукт',
  CATEGORY = 'Категория',
  SEARCH = 'Запрос',
}
