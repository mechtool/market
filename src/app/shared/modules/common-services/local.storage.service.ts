import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {
  SuggestionCategoryItemModel,
  SuggestionModel,
  SuggestionProductItemModel,
  SuggestionSearchQueryHistoryItemModel,
  TypeOfSearch,
} from '../common-services/models';

const STORAGE_KEY = 'local_search_queries_history_list';

@Injectable()
export class LocalStorageService {

  constructor(@Inject(LOCAL_STORAGE) private _storage: StorageService) {
  }

  public getSearchQueriesHistoryList(): SuggestionModel {
    const _searchQueries = this._storage.get(STORAGE_KEY) || [];
    return {
      searchQueriesHistory: _searchQueries.reverse()
    };
  }

  public putSearchQuery(searchQuery: SuggestionSearchQueryHistoryItemModel): void {
    const historyList = this._storage.get(STORAGE_KEY) || [];
    const filterHistoryList = historyList.filter(res => res.searchText !== searchQuery.searchText);
    const query = {
      id: searchQuery.id,
      imageUrl: searchQuery.imageUrl,
      searchText: searchQuery.searchText,
      typeOfSearch: searchQuery.typeOfSearch,
    };
    filterHistoryList.push(query);
    this._storage.set(STORAGE_KEY, filterHistoryList);
  }

  public putSearchText(_searchText: string): void {
    const historyList = this._storage.get(STORAGE_KEY) || [];
    const filterHistoryList = historyList.filter(res => res.searchText !== _searchText);
    const query = {
      id: '',
      imageUrl: '',
      searchText: _searchText,
      typeOfSearch: TypeOfSearch.SEARCH,
    };
    filterHistoryList.push(query);
    this._storage.set(STORAGE_KEY, filterHistoryList);
  }

  putSearchProduct(searchProduct: SuggestionProductItemModel) {
    const historyList = this._storage.get(STORAGE_KEY) || [];
    const filterHistoryList = historyList.filter(res => res.searchText !== searchProduct.productName);
    const query = {
      id: searchProduct.id,
      imageUrl: searchProduct.imageUrl,
      searchText: searchProduct.productName,
      typeOfSearch: TypeOfSearch.PRODUCT,
    };
    filterHistoryList.push(query);
    this._storage.set(STORAGE_KEY, filterHistoryList);
  }

  putSearchCategory(searchCategory: SuggestionCategoryItemModel) {
    const historyList = this._storage.get(STORAGE_KEY) || [];
    const filterHistoryList = historyList.filter(res => res.searchText !== searchCategory.categoryName);
    const query = {
      id: searchCategory.categoryId,
      imageUrl: searchCategory.imageUrl,
      searchText: searchCategory.categoryName,
      typeOfSearch: TypeOfSearch.CATEGORY,
    };
    filterHistoryList.push(query);
    this._storage.set(STORAGE_KEY, filterHistoryList);
  }

}
