import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {
  LocationModel,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
  SuggestionResponseModel,
  SuggestionSearchQueryHistoryModel,
  TypeOfSearch,
} from '../common-services/models';

const SEARCH_QUERIES_HISTORY_STORAGE_KEY = 'local_search_queries_history_list';
const USER_LOCATION_STORAGE_KEY = 'local_user_location';

@Injectable()
export class LocalStorageService {

  constructor(@Inject(LOCAL_STORAGE) private _storage: StorageService) {
  }

  getSearchQueriesHistoryList(query?: string): SuggestionResponseModel {
    let searchQueries;
    if (query && query.trim().length) {
      const historyList = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY);
      const queryLowerCase = query.toLowerCase();
      searchQueries = historyList.filter(res => res.searchText.toLowerCase().includes(queryLowerCase));
    } else {
      searchQueries = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY) || [];
    }
    return {
      searchQueriesHistory: searchQueries.reverse()
    };
  }

  hasSearchQueriesHistory(): boolean {
    const history = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY);
    return !!history;
  }

  removeSearchQuery(id: string): void {
    const historyList = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY);
    const filterHistoryList = historyList.filter(res => res.id !== id);
    this._storage.set(SEARCH_QUERIES_HISTORY_STORAGE_KEY, filterHistoryList.length ? filterHistoryList : undefined);
  }

  putSearchQuery(searchQuery: SuggestionSearchQueryHistoryModel): void {
    const historyList = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY) || [];
    const filterHistoryList = historyList.filter(res => res.id !== searchQuery.id);
    const query = {
      id: searchQuery.id,
      imageUrl: searchQuery.imageUrl,
      searchText: searchQuery.searchText,
      typeOfSearch: searchQuery.typeOfSearch,
    };
    filterHistoryList.push(query);
    this._storage.set(SEARCH_QUERIES_HISTORY_STORAGE_KEY, filterHistoryList);
  }

  putSearchText(_searchText: string): void {
    if (_searchText) {
      const historyList = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY) || [];
      const hexId = this.toHexId(_searchText);
      const filterHistoryList = historyList.filter(res => res.id !== hexId);
      const query = {
        id: hexId,
        imageUrl: 'assets/img/svg/quick_search_history.svg',
        searchText: _searchText,
        typeOfSearch: TypeOfSearch.SEARCH,
      };
      filterHistoryList.push(query);
      this._storage.set(SEARCH_QUERIES_HISTORY_STORAGE_KEY, filterHistoryList);
    }
  }

  putSearchProduct(product: SuggestionProductItemModel) {
    const historyList = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY) || [];
    const filterHistoryList = historyList.filter(res => res.searchText !== product.name);
    const query = {
      id: product.id,
      imageUrl: product.images ? product.images[0].href : 'assets/img/tmp/no_photo.png',
      searchText: product.name,
      typeOfSearch: TypeOfSearch.PRODUCT,
    };
    filterHistoryList.push(query);
    this._storage.set(SEARCH_QUERIES_HISTORY_STORAGE_KEY, filterHistoryList);
  }

  putSearchCategory(category: SuggestionCategoryItemModel) {
    const historyList = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY) || [];
    const filterHistoryList = historyList.filter(res => res.searchText !== category.name);
    const query = {
      id: category.id,
      imageUrl: 'assets/img/tmp/lightning.png',
      searchText: category.name,
      typeOfSearch: TypeOfSearch.CATEGORY,
    };
    filterHistoryList.push(query);
    this._storage.set(SEARCH_QUERIES_HISTORY_STORAGE_KEY, filterHistoryList);
  }


  getUserLocation(): LocationModel {
    return this._storage.get(USER_LOCATION_STORAGE_KEY);
  }

  putUserLocation(location: LocationModel) {
    this._storage.set(USER_LOCATION_STORAGE_KEY, location);
  }

  hasUserLocation(): boolean {
    return this._storage.get(USER_LOCATION_STORAGE_KEY) !== undefined;
  }

  removeUserLocation(): void {
    this._storage.remove(USER_LOCATION_STORAGE_KEY);
  }

  private toHexId(text: string): string {
    let hex = '';
    for (let i = 0; i < text.length; i++) {
      hex += text.charCodeAt(i).toString(16);
    }
    return hex;
  }
}
