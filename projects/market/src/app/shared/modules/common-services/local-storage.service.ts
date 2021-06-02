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
import { hexFrom } from '#shared/utils';
import {BehaviorSubject} from "rxjs";

const SEARCH_QUERIES_HISTORY_STORAGE_KEY = 'search_queries_history_list';
const USER_LOCATION_STORAGE_KEY = 'user_location';
const USER_GEOLOCATION_STORAGE_KEY = 'user_geolocation';
const CART_LOCATION_LINK_STORAGE_KEY = 'cart_location';
const USER_DATA_STORAGE_KEY = 'user_data';
const COOKIES_AGREEMENT_STORAGE_KEY = 'cookies_agreement';
const LATER_VISIT_MY_ORGANIZATIONS_STORAGE_KEY = 'later_visit_my_organizations';
const HOME_REGION_SELECTED_STORAGE_KEY = 'home_region_selected';

@Injectable()
export class LocalStorageService {
  isRegionSelected$: BehaviorSubject<boolean> = new BehaviorSubject(this._storage.get(HOME_REGION_SELECTED_STORAGE_KEY));

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
      const hexId = hexFrom(_searchText);
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

  getUserGeolocation(): any {
    return this._storage.get(USER_GEOLOCATION_STORAGE_KEY);
  }

  hasUserGeolocation(): boolean {
    return this._storage.get(USER_GEOLOCATION_STORAGE_KEY) !== undefined;
  }

  putUserGeolocation(geolocation: any) {
    this._storage.set(USER_GEOLOCATION_STORAGE_KEY, geolocation);
  }

  getCartLocationLink(): string {
    return this._storage.get(CART_LOCATION_LINK_STORAGE_KEY);
  }

  putCartLocationLink(marketplaceLink: string): void {
    this._storage.set(CART_LOCATION_LINK_STORAGE_KEY, marketplaceLink);
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

  approveRegion() {
    this.isRegionSelected$.next(true);
    this._storage.set(HOME_REGION_SELECTED_STORAGE_KEY, true);
  }

  resetRegion() {
    this._storage.set(HOME_REGION_SELECTED_STORAGE_KEY, false);
  }

  isApproveRegion() {
    return this._storage.get(HOME_REGION_SELECTED_STORAGE_KEY);
  }
}
