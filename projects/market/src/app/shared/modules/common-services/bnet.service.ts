import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CacheService } from './cache.service';
import { environment } from '#environments/environment';
import { Observable } from 'rxjs';
import {
  AccessKeyModel,
  AccessKeyResponseModel,
  CartDataResponseModel,
  CartModel,
  CategoryRequestModel,
  CategoryResponseModel,
  CommerceMlDocumentResponseModel,
  CounterpartyResponseModel,
  DocumentResponseModel,
  EdiRequestModel,
  FeedbackRequestModel,
  LocationModel,
  OrganizationAdminResponseModel,
  OrganizationResponseModel,
  OrganizationUserResponseModel,
  ParticipationRequestRequestModel,
  ParticipationRequestResponseModel,
  ProductOfferRequestModel,
  ProductOfferResponseModel,
  ProductOffersListResponseModel,
  ProductOffersRequestModel,
  RegisterOrganizationRequestModel,
  SuggestionResponseModel,
  SuppliersRequestModel,
  SuppliersResponseModel,
  TradeOfferResponseModel,
  TradeOffersListResponseModel,
  TradeOffersRequestModel,
  UpdateOrganizationContactPersonRequestModel,
  UpdateOrganizationRequestModel,
  UserOrganizationModel,
} from './models';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { ApiWorkerService } from './api-worker.service';

const API_URL = environment.apiUrl;

@Injectable()
export class BNetService {
  constructor(
    private _apiService: ApiService,
    private _cacheService: CacheService,
    private _apiWorkerService: ApiWorkerService,
    private _http: HttpClient,
  ) {
  }

  getProductOffer(id: string, filterQuery?: ProductOfferRequestModel): Observable<ProductOfferResponseModel> {
    const params = this._params(filterQuery);
    return this._apiService.get(`${API_URL}/product-offers/${id}`, { params });
  }

  getPopularProducts(categoryId?: string): Observable<ProductOffersListResponseModel> {
    const params = categoryId ? new HttpParams().set('categoryId', categoryId) : undefined;
    return this._apiService.get(`${API_URL}/product-offers/popular`, { params });
  }

  searchProductOffers(searchQuery: ProductOffersRequestModel, cacheable = true): Observable<ProductOffersListResponseModel> {
    const params = this._params(searchQuery);
    return cacheable
      ? this._cacheService.get(`${API_URL}/product-offers`, params)
      : this._apiService.get(`${API_URL}/product-offers`, { params });
  }

  getTradeOffer(id: string): Observable<TradeOfferResponseModel> {
    return this._apiService.get(`${API_URL}/trade-offers/${id}`);
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

  getOrganizationProfile(id: string): Observable<OrganizationResponseModel> {
    return this._apiService.get(`${API_URL}/organizations/profiles/${id}`);
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

  getOwnParticipationRequests(): Observable<ParticipationRequestResponseModel[]> {
    return this._apiService.get(`${API_URL}/organizations/own-participation-requests`);
  }

  getParticipationRequests(query: ParticipationRequestRequestModel): Observable<ParticipationRequestResponseModel[]> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/organizations/participation-requests`, { params });
  }

  acceptParticipationRequestById(id: string): Observable<any> {
    return this._apiService.get(`${API_URL}/organizations/participation-requests/${id}/accept`);
  }

  rejectParticipationRequestById(id: string): Observable<any> {
    return this._apiService.get(`${API_URL}/organizations/participation-requests/${id}/reject`);
  }

  obtainAccessKey(orgId: string): Observable<AccessKeyModel> {
    return this._apiService.post(`${API_URL}/organizations/access-keys/obtain`, { organizationId: orgId });
  }

  getAccessKeys(): Observable<AccessKeyResponseModel[]> {
    return this._apiService.get(`${API_URL}/organizations/access-keys`);
  }

  registerOrganization(data: RegisterOrganizationRequestModel): Observable<any> {
    return this._apiService.post(`${API_URL}/organizations`, data);
  }

  updateOrganization(id: string, data: UpdateOrganizationRequestModel): Observable<any> {
    return this._apiService.patch(`${API_URL}/organizations/${id}`, data);
  }

  updateOrganizationContact(id: string, data: UpdateOrganizationContactPersonRequestModel): Observable<any> {
    return this._apiService.put(`${API_URL}/organizations/${id}/contact`, data);
  }

  acceptParticipationRequest(requestId: string): Observable<any> {
    return this._apiService.put(`${API_URL}/organizations/participation-requests/${requestId}/accept`);
  }

  rejectParticipationRequest(requestId: string): Observable<any> {
    return this._apiService.put(`${API_URL}/organizations/participation-requests/${requestId}/reject`);
  }

  deleteUserFromOrganization(id: string, userId: string): Observable<any> {
    return this._apiService.delete(`${API_URL}/organizations/${id}/users/${userId}`);
  }

  deleteAccessKey(accessKeyId: string): Observable<any> {
    return this._apiService.delete(`${API_URL}/organizations/access-keys/${accessKeyId}`);
  }

  getOrganizationUsers(id: string): Observable<OrganizationUserResponseModel[]> {
    return this._apiService.get(`${API_URL}/organizations/${id}/users`);
  }

  searchLocations(textQuery: string, level: string): Observable<LocationModel[]> {
    const params = new HttpParams().set('textQuery', textQuery).set('level', level);
    return this._apiService.get(`${API_URL}/locations/search`, { params });
  }

  containsFiasAddress(query: { fiasId: string; fiasIds: string[] }): Observable<boolean> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/locations/contains`, { params });
  }

  searchSuppliers(query: SuppliersRequestModel): Observable<SuppliersResponseModel> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/suppliers`, { params });
  }

  getCategories(query?: CategoryRequestModel, withWebWorker = false): Observable<CategoryResponseModel> {
    const params = this._params(query);
    if (!withWebWorker) {
      return this._apiService.get(`${API_URL}/categories`, { params });
    }
    if (withWebWorker) {
      return this._apiWorkerService.get(`${API_URL}/categories`, { params });
    }
  }

  sendFeedback(feedback: FeedbackRequestModel, token: string): Observable<any> {
    return this._apiService.post(`${API_URL}/email/feedback?token=${token}`, feedback);
  }

  createCart(): Observable<HttpResponse<any>> {
    return this._http.post(`${API_URL}/shopping-carts`, null, { observe: 'response' });
  }

  getCart(cartLocation: string): Observable<CartDataResponseModel> {
    return this._apiService.get(`${API_URL}/shopping-carts`,
      { headers: new HttpHeaders({ MarketplaceLink: cartLocation }) });
  }

  addItemToCart(relationHref: string, data: CartModel): Observable<any> {
    return this._http.post(`${API_URL}/shopping-carts/items`, data,
      { headers: new HttpHeaders({ MarketplaceLink: relationHref }) });
  }

  removeItemFromCart(relationHref: string): Observable<any> {
    return this._http.delete(`${API_URL}/shopping-carts/items`,
      { headers: new HttpHeaders({ MarketplaceLink: relationHref }) });
  }

  updateItemQuantityInCart(relationHref: string, data: CartModel): Observable<any> {
    return this._http.put(`${API_URL}/shopping-carts/items`, data,
      { headers: new HttpHeaders({ MarketplaceLink: relationHref }) });
  }

  marketplaceOffer(relationHref: string, data: CartModel): Observable<any> {
    return this._http.post(`${API_URL}/shopping-carts/marketplace-offer`, data,
      { headers: new HttpHeaders({ MarketplaceLink: relationHref }) });
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

  findCounterpartyDataByInn(inn: string): Observable<CounterpartyResponseModel> {
    return this._apiService.get(`${API_URL}/counterparty/${inn}`);
  }

  private _params(searchQuery: any): HttpParams {
    let params = new HttpParams();
    if (searchQuery) {
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
    }
    return params;
  }
}
