import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {
  CartDataModel,
  CartDataOrderModel,
  CartDataResponseModel,
  LocationModel,
  RelationEnumModel,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
  SuggestionResponseModel,
  SuggestionSearchQueryHistoryModel,
  TypeOfSearch,
} from '../common-services/models';

const SEARCH_QUERIES_HISTORY_STORAGE_KEY = 'search_queries_history_list';
const USER_LOCATION_STORAGE_KEY = 'user_location';
const CART_LOCATION_STORAGE_KEY = 'cart_location';
const CART_DATA_STORAGE_KEY = 'cart_data';
const USER_DATA_STORAGE_KEY = 'user_data';
const COOKIES_AGREEMENT_STORAGE_KEY = 'cookies_agreement';
const LATER_VISIT_MY_ORGANIZATIONS_STORAGE_KEY = 'later_visit_my_organizations';

@Injectable()
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE) private _storage: StorageService) {
  }

  getSearchQueriesHistoryList(query?: string): SuggestionResponseModel {
    let searchQueries;
    if (query && query.trim().length) {
      const historyList = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY);
      const queryLowerCase = query.toLowerCase();
      searchQueries = historyList.filter((res) => res.searchText.toLowerCase().includes(queryLowerCase));
    } else {
      searchQueries = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY) || [];
    }
    return {
      searchQueriesHistory: searchQueries.reverse(),
    };
  }

  getSearchQueriesHistoryListNEW(): SuggestionSearchQueryHistoryModel[] {
    return (this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY) || []).reverse();
  }

  hasSearchQueriesHistory(): boolean {
    const history = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY);
    return !!history;
  }

  removeSearchQuery(id: string): void {
    const currentHistoryList = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY);
    const updateHistoryList = currentHistoryList.filter((res) => res.id !== id);
    this._storage.remove(SEARCH_QUERIES_HISTORY_STORAGE_KEY);
    this._storage.set(SEARCH_QUERIES_HISTORY_STORAGE_KEY, updateHistoryList);
  }

  putSearchQuery(searchQuery: SuggestionSearchQueryHistoryModel): void {
    const historyList = this._storage.get(SEARCH_QUERIES_HISTORY_STORAGE_KEY) || [];
    const filterHistoryList = historyList.filter((res) => res.id !== searchQuery.id);
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
      const filterHistoryList = historyList.filter((res) => res.id !== hexId);
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
    const filterHistoryList = historyList.filter((res) => res.searchText !== product.name);
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
    const filterHistoryList = historyList.filter((res) => res.searchText !== category.name);
    const query = {
      id: category.id,
      imageUrl: 'assets/img/tmp/lightning.png',
      searchText: category.name,
      typeOfSearch: TypeOfSearch.CATEGORY,
    };
    filterHistoryList.push(query);
    this._storage.set(SEARCH_QUERIES_HISTORY_STORAGE_KEY, filterHistoryList);
  }

  getUserData(): LocationModel {
    return this._storage.get(USER_DATA_STORAGE_KEY);
  }

  putUserData(userData: any) {
    this._storage.set(USER_DATA_STORAGE_KEY, userData);
  }

  hasUserData(): boolean {
    return this._storage.get(USER_DATA_STORAGE_KEY) !== undefined;
  }

  removeUserData(): void {
    this._storage.remove(USER_DATA_STORAGE_KEY);
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

  getUserAndCookiesAgreement(): boolean {
    return this._storage.get(COOKIES_AGREEMENT_STORAGE_KEY);
  }

  putUserAndCookiesAgreement() {
    this._storage.set(COOKIES_AGREEMENT_STORAGE_KEY, true);
  }

  putDateOfLaterVisitMyOrganizations(date: number): void {
    this._storage.set(LATER_VISIT_MY_ORGANIZATIONS_STORAGE_KEY, date);
  }

  getDateOfLaterVisitMyOrganizations(): string {
    return this._storage.get(LATER_VISIT_MY_ORGANIZATIONS_STORAGE_KEY);
  }

  private toHexId(text: string): string {
    let hex = '';
    for (let i = 0; i < text.length; i++) {
      hex += text.charCodeAt(i).toString(16);
    }
    return hex;
  }
}
