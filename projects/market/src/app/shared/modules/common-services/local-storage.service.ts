import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {
  LocationModel,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
  SuggestionResponseModel,
  SuggestionSearchQueryHistoryModel,
  TypeOfSearch,
  CartDataOrderModel,
  CartDataModel,
  CartDataResponseModel,
  RelationEnumModel,
} from '../common-services/models';

const SEARCH_QUERIES_HISTORY_STORAGE_KEY = 'search_queries_history_list';
const USER_LOCATION_STORAGE_KEY = 'user_location';
const LAST_DATE_USER_ACCOUNT_STORAGE_KEY = 'last_date_user_account';
const CART_LOCATION_STORAGE_KEY = 'cart_location';
const CART_DATA_STORAGE_KEY = 'cart_data';

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

  getCartLocation(): string {
    return this._storage.get(CART_LOCATION_STORAGE_KEY);
  }

  putCartLocation(catLocation: string): void {
    this._storage.set(CART_LOCATION_STORAGE_KEY, catLocation);
  }

  removeCartLocation(): void {
    this._storage.remove(CART_LOCATION_STORAGE_KEY);
  }

  getCartData(): CartDataModel | CartDataResponseModel {
    return this._storage.get(CART_DATA_STORAGE_KEY);
  }

  putCartData(data: any): void {
    this._storage.set(CART_DATA_STORAGE_KEY, data);
  }

  removeCartData(): void {
    this._storage.remove(CART_DATA_STORAGE_KEY);
  }

  patchCartDataByOrder(orderData: CartDataOrderModel): void {
    const currentCartData = this.getCartData();
    let foundInd;

    if (currentCartData && orderData) {
      const currentDataContent = currentCartData?.content;
      const orderRelationRef = orderData._links?.[RelationEnumModel.ORDER_CREATE]?.href;
      const orderFoundInCurrentDataContent = currentDataContent?.find((item, ind) => {
        if (item._links?.[RelationEnumModel.ORDER_CREATE]?.href === orderRelationRef) {
          foundInd = ind;
          return true;
        }
        return false;
      });
      const newOrder = JSON.parse(JSON.stringify(orderFoundInCurrentDataContent));
      newOrder.consumer = orderFoundInCurrentDataContent ? orderData.consumer || null : null;
      newOrder.items = orderFoundInCurrentDataContent ? orderData.items || null : null;
      currentCartData?.content.splice(foundInd, 1, newOrder);
      this._storage.set(CART_DATA_STORAGE_KEY, currentCartData);
    }
  }

  getLastDateUserAccount(uin: string): number {
    const lastDates = this._storage.get(LAST_DATE_USER_ACCOUNT_STORAGE_KEY) || {};
    return lastDates[uin];
  }

  putLastDateUserAccount(uin: string, newLastDate: number) {
    const lastDates = this._storage.get(LAST_DATE_USER_ACCOUNT_STORAGE_KEY) || {};
    lastDates[uin] = newLastDate;
    this._storage.set(LAST_DATE_USER_ACCOUNT_STORAGE_KEY, lastDates);
  }

  private toHexId(text: string): string {
    let hex = '';
    for (let i = 0; i < text.length; i++) {
      hex += text.charCodeAt(i).toString(16);
    }
    return hex;
  }
}
