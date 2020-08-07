import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '#environments/environment';
import { Observable } from 'rxjs';
import {
  CartAddItemRequestModel,
  CartCreateOrderRequestModel,
  CartDataResponseModel,
  CartUpdateItemQuantityRequestModel,
  CategoryRequestModel,
  CategoryResponseModel,
  CommerceMlDocumentResponseModel,
  DocumentResponseModel,
  EdiRequestModel,
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
  OrganizationAdminResponseModel,
  AccessKeyResponseModel,
  ParticipationRequestResponseModel,
  RegisterOrganizationRequestModel,
  AccessKeyModel,
} from './models';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';

const API_URL = environment.apiUrl;

@Injectable()
export class BNetService {
  constructor(
    private _apiService: ApiService,
    private _http: HttpClient,
  ) {
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

  getOrganization(id: string): Observable<OrganizationResponseModel> {
    return this._apiService.get(`${API_URL}/organizations/${id}`);
  }

  getOrganizationAdminsByLegalId(legalId: string): Observable<OrganizationAdminResponseModel[]> {
    return this._apiService.get(`${API_URL}/organizations/admins/${legalId}`);
  }

  getOrganizationByLegalId(legalId: string): Observable<OrganizationResponseModel> {
    return this._apiService.get(`${API_URL}/organizations/by-legal-id/${legalId}`);
  }

  sendParticipationRequest(data: any): Observable<any> {
    return this._apiService.post(`${API_URL}/organizations/participation-requests`, data);
  }

  getParticipationRequests(): Observable<ParticipationRequestResponseModel[]> {
    return this._apiService.get(`${API_URL}/organizations/participation-requests`);
  }

  obtainAccessKey(orgId: string): Observable<AccessKeyModel> {
    return this._apiService.post(`${API_URL}/organizations/access-keys/obtain`, { organizationId: orgId });
  }

  registerOrganization(data: RegisterOrganizationRequestModel): Observable<any> {
    return this._apiService.post(`${API_URL}/organizations`, data);
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

  createCart(): Observable<HttpResponse<any>> {
    return this._http.post(`${API_URL}/shopping-carts`, null, { observe: 'response' });
  }

  getCartDataByCartLocation(cartLocation: string): Observable<CartDataResponseModel> {
    return this._apiService.get(cartLocation);
  }

  addItemToCart(relationHref: string, data: CartAddItemRequestModel): Observable<any> {
    return this._apiService.post(relationHref, data);
  }

  removeItemFromCart(relationHref: string): Observable<any> {
    return this._apiService.delete(relationHref);
  }

  updateItemQuantityInCart(relationHref: string, data: CartUpdateItemQuantityRequestModel): Observable<any> {
    return this._apiService.put(relationHref, data);
  }

  createOrder(relationHref: string, data: CartCreateOrderRequestModel): Observable<any> {
    return this._apiService.post(relationHref, data);
  }

  getTradeOfferFromCart(relationHref: string): Observable<any> {
    return this._apiService.get(relationHref);
  }

  getOrders(query: EdiRequestModel): Observable<DocumentResponseModel[]> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/edi/orders`, { params });
  }

  getOrderDocument(id: number): Observable<CommerceMlDocumentResponseModel> {
    return this._apiService.get(`${API_URL}/edi/orders/${id}`);
  }

  getAccounts(query: EdiRequestModel): Observable<DocumentResponseModel[]> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/edi/accounts`, { params });
  }

  getAccountDocument(id: number): Observable<CommerceMlDocumentResponseModel> {
    return this._apiService.get(`${API_URL}/edi/accounts/${id}`);
  }

  private _params(searchQuery: any): HttpParams {
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


