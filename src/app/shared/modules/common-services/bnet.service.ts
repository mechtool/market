import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '#environments/environment';
import { Observable } from 'rxjs';
import {
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
  UserOrganizationModel,
} from './models';
import { HttpParams } from '@angular/common/http';

const API_URL = environment.apiUrl;

@Injectable()
export class BNetService {
  constructor(private _apiService: ApiService) {}

  getProductOffer(
    id: string,
    filterQuery?: ProductOfferRequestModel
  ): Observable<ProductOfferResponseModel> {
    const params = this._params(filterQuery);
    return this._apiService.get(`${API_URL}/product-offers/${id}`, { params });
  }

  searchNomenclatures(
    searchQuery: ProductOffersRequestModel
  ): Observable<ProductOffersListResponseModel> {
    const params = this._params(searchQuery);
    return this._apiService.get(`${API_URL}/product-offers`, { params });
  }

  getTradeOffer(id: string): Observable<TradeOfferResponseModel> {
    return this._apiService.get(`${API_URL}/trade-offers/${id}`);
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

  searchSuppliers(
    query: SuppliersRequestModel
  ): Observable<SuppliersResponseModel> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/suppliers`, { params });
  }

  getCategories(): Observable<CategoryResponseModel> {
    return this._apiService.get(`${API_URL}/categories`);
  }

  private _params(searchQuery: any): HttpParams {
    if (searchQuery) {
      let params = new HttpParams();
      Object.keys(searchQuery).forEach((queryParam) => {
        if (searchQuery[queryParam]?.toString()) {
          params = params.append(queryParam, searchQuery[queryParam]);
        }
      });
      return params;
    }
  }
}
