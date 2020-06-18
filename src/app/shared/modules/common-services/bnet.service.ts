import { RelationModel } from './models/relation.model';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '#environments/environment';
import { Observable, of } from 'rxjs';
import {
  CategoryRequestModel,
  CategoryResponseModel,
  LocationModel,
  OrganizationResponseModel,
  ProductOfferRequestModel,
  ProductOfferResponseModel,
  ProductOffersListResponseModel,
  ProductOffersRequestModel,
  SuggestionResponseModel,
  SuppliersRequestModel,
  SuppliersResponseModel,
  TradeOfferResponseModel,
  TradeOffersListResponseModel,
  TradeOffersRequestModel,
  UserOrganizationModel,
  CartAddItemModel,
  MakeOrderModel,
  CartUpdateItemQuantityModel,
  CartDataModel,
} from './models';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { RelationContentModel } from './models/relation-content.model';

const API_URL = environment.apiUrl;

@Injectable()
export class BNetService {
  constructor(private _apiService: ApiService) {
  }

  getProductOffer(id: string, filterQuery?: ProductOfferRequestModel): Observable<ProductOfferResponseModel> {
    const params = this._params(filterQuery);
    return this._apiService.get(`${API_URL}/product-offers/${id}`, { params });
  }

  getPopularProducts(): Observable<ProductOffersListResponseModel> {
    return this._apiService.get(`${API_URL}/product-offers/popular`);
  }

  searchProductOffers(searchQuery: ProductOffersRequestModel): Observable<ProductOffersListResponseModel> {
    const params = this._params(searchQuery);
    return this._apiService.get(`${API_URL}/product-offers`, { params });
  }

  getTradeOffer(id: string): Observable<TradeOfferResponseModel> {
    return this._apiService.get(`${API_URL}/trade-offers/find/${id}`);
  }

  searchTradeOffers(query: TradeOffersRequestModel): Observable<TradeOffersListResponseModel> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/trade-offers/search`, { params });
  }

  searchSuggestions(query: string): Observable<SuggestionResponseModel> {
    const params = new HttpParams().set('q', query);
    return this._apiService.get(`${API_URL}/suggestions`, { params });
  }

  getUserOrganizations(): Observable<UserOrganizationModel[]> {
    return this._apiService.get(`${API_URL}/organizations/user-organizations`);
  }

  // TODO: метод возвращает 404
  getOrganization(id: string): Observable<OrganizationResponseModel> {
    return this._apiService.get(`${API_URL}/organizations/${id}`);
  }

  searchLocations(textQuery: string): Observable<LocationModel[]> {
    const params = new HttpParams().set('textQuery', textQuery);
    return this._apiService.get(`${API_URL}/locations/search`, { params });
  }

  searchSuppliers(query: SuppliersRequestModel): Observable<SuppliersResponseModel> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/suppliers`, { params });
  }

  getCategories(query?: CategoryRequestModel): Observable<CategoryResponseModel> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/categories`, { params });
  }

  createCart(): Observable<string> {
    // TODO: Использовать реальный сервис
    return of('https://api.1cbn.ru/trade-offers/shopping-carts/3071d88f-4fe8-418d-be46-7822d247cd91');
  }

  getCartDataByCartLocation(cartLocation: string): Observable<CartDataModel> {
    // TODO: Использовать реальный сервис
    return this._apiService.get(`/assets/json/raw/cart_data.json`);
  }

  addItemToCart(relationHref: string, data: CartAddItemModel): Observable<any> {
    // let headers = new HttpHeaders({ 'Content-Type': 'application/vnd.1cbn.v1+json' });
    // let options = { headers: headers };
    // return this._apiService.post(relationHref, data, options);
    return this._apiService.get('/assets/json/raw/cart_add-item.json');
  }

  makeOrder(relationHref: string, data: MakeOrderModel): Observable<any> {
    // let headers = new HttpHeaders({ 'Content-Type': 'application/vnd.1cbn.v1+json' });
    // let options = { headers: headers };
    // return this._apiService.post(relationHref, data, options);
    return this._apiService.get(`/assets/json/raw/make-order.json`);
  }

  updateItemQuantityInCart(relationHref: string, data: CartUpdateItemQuantityModel): Observable<any> {
    // let headers = new HttpHeaders({ 'Content-Type': 'application/vnd.1cbn.v1+json' });
    // let options = { headers: headers };
    // return this._apiService.post(relationHref, data, options);
    return this._apiService.get(`/assets/json/raw/cart_update-item-quantity.json`);
  }

  removeItemFromCart(relationHref: string): Observable<any> {
    // return this._apiService.delete(relationHref);
    return this._apiService.get(`/assets/json/raw/cart_remove-item.json`);
  }

  getTradeOfferFromCart(relationHref: string): Observable<any> {
    // return this._apiService.get(relationHref);
    return this._apiService.get(`/assets/json/raw/trade-offer-view.json`);
  }

  _params(searchQuery: any): HttpParams {
    if (searchQuery) {
      let params = new HttpParams();
      Object.keys(searchQuery).forEach((queryParam) => {
        if (searchQuery[queryParam]?.toString()) {
          if (Array.isArray(searchQuery[queryParam])) {
            searchQuery[queryParam].forEach((value) => {
              params = params.append(`${queryParam}[]`, value);
            });
          } else {
            params = params.append(queryParam, searchQuery[queryParam]);
          }
        }
      });
      return params;
    }
  }
}


