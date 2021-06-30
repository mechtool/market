import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CacheService } from './cache.service';
import { environment } from '#environments/environment';
import { Observable } from 'rxjs';
import {
  AccessKeyModel,
  AccessKeyResponseModel,
  BannersListResponseModel,
  CartDataResponseModel,
  CartModel,
  CategoriesMappingModel,
  CategoryRequestModel,
  CategoryResponseModel,
  CommerceMlDocumentResponseModel, CommerceOfferMlModel,
  CounterpartyResponseModel,
  DocumentResponseModel,
  EdiRequestModel,
  FeedbackRequestModel, IDocumentOfferDTO,
  LocationModel,
  OrganizationAdminResponseModel,
  OrganizationResponseModel,
  OrganizationUserResponseModel,
  PagesStaticListResponseModel,
  ParticipationRequestRequestModel,
  ParticipationRequestResponseModel,
  PriceListResponseModel,
  ProductOfferRequestModel,
  ProductOfferResponseModel,
  ProductOffersListResponseModel,
  ProductOffersRequestModel,
  ProductsHighlightListResponseModel,
  RegisterOrganizationRequestModel,
  RfpItemResponseModel,
  RfpListResponseModel,
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

const API_URL = environment.apiUrl;

@Injectable()
export class BNetService {
  constructor(
    private _http: HttpClient,
    private _apiService: ApiService,
    private _cacheService: CacheService,
  ) {
  }

  getProductOffer(id: string, filterQuery?: ProductOfferRequestModel): Observable<ProductOfferResponseModel> {
    const params = this._params(filterQuery);
    return this._apiService.get(`${API_URL}/product-offers/${id}`, { params });
  }

  getPopularProducts(): Observable<ProductOffersListResponseModel> {
    return this._apiService.get(`${API_URL}/product-offers/popular`);
  }

  searchProductOffers(searchQuery: ProductOffersRequestModel, cacheable = true): Observable<ProductOffersListResponseModel> {
    const params = this._params(searchQuery);
    return cacheable
      ? this._cacheService.get(`${API_URL}/product-offers`, params)
      : this._apiService.get(`${API_URL}/product-offers`, { params });
  }

  getProductsHighlight(): Observable<ProductsHighlightListResponseModel> {
    return this._apiService.get(`${API_URL}/products-highlight`);
  }

  placePriceList(priceList: any): Observable<any> {
    return this._apiService.post(`${API_URL}/price-lists`, priceList);
  }

  updatePriceList(priceListId: string, priceList: any): Observable<any> {
    return this._apiService.put(`${API_URL}/price-lists/${priceListId}`, priceList);
  }

  getPriceLists(): Observable<PriceListResponseModel[]> {
    return this._apiService.get(`${API_URL}/price-lists`);
  }

  getPriceList(priceListExternalId: string): Observable<PriceListResponseModel> {
    return this._apiService.get(`${API_URL}/price-lists/${priceListExternalId}`);
  }

  deletePriceList(id: string): Observable<any> {
    return this._apiService.delete(`${API_URL}/price-lists/${id}`);
  }

  getPriceListTemplateFile(): Observable<any> {
    return this._apiService.get(`${API_URL}/price-lists/feed/price-list-template-file`);
  }

  placePriceListFeed(priceListExternalId: string, feed: any): Observable<any> {
    return this._apiService.put(`${API_URL}/price-lists/feed/${priceListExternalId}`, feed);
  }

  getPriceListFeed(priceListExternalId: string): Observable<any> {
    return this._apiService.get(`${API_URL}/price-lists/feed/${priceListExternalId}`);
  }

  deletePriceListFeed(priceListExternalId: string): Observable<any> {
    return this._apiService.delete(`${API_URL}/price-lists/feed/${priceListExternalId}`);
  }

  startFeed(priceListExternalId: string): Observable<any> {
    return this._apiService.get(`${API_URL}/price-lists/feed/${priceListExternalId}/start`);
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

  getLocations(fiasIds: string[]): Observable<LocationModel[]> {
    const params = this._params({ fiasId: fiasIds });
    return this._apiService.get(`${API_URL}/locations/find-all`, { params });
  }

  containsFiasAddress(query: { fiasId: string; fiasIds: string[] }): Observable<boolean> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/locations/contains`, { params });
  }

  searchSuppliers(query: SuppliersRequestModel): Observable<SuppliersResponseModel> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/suppliers`, { params });
  }

  getCategories(query?: CategoryRequestModel): Observable<CategoryResponseModel> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/categories`, { params });
  }

  saveCategoriesMapping(organizationId: string, body: CategoriesMappingModel): Observable<any> {
    return this._apiService.put(`${API_URL}/categories/mapping/${organizationId}`, body);
  }

  getCategoriesMapping(organizationId: string): Observable<CategoriesMappingModel> {
    return this._apiService.get(`${API_URL}/categories/mapping/${organizationId}`);
  }

  get1CnCategories(): Observable<any[]> {
    return this._apiService.get(`${API_URL}/categories/1cn`);
  }

  sendFeedback(feedback: FeedbackRequestModel, token: string): Observable<any> {
    return this._apiService.post(`${API_URL}/email/feedback?token=${token}`, feedback);
  }

  createCart(): Observable<HttpResponse<any>> {
    return this._http.post(`${API_URL}/shopping-carts`, null, { observe: 'response' });
  }

  getCart(link: string): Observable<CartDataResponseModel> {
    return this._apiService.get(link);
  }

  addItemToCart(link: string, data: CartModel): Observable<any> {
    return this._apiService.post(link, data);
  }

  removeItemFromCart(link: string): Observable<any> {
    return this._apiService.delete(link);
  }

  updateItemQuantityInCart(link: string, data: CartModel): Observable<any> {
    return this._apiService.put(link, data);
  }

  marketplaceOffer(link: string, data: CartModel, recaptchaToken?: string): Observable<any> {
    if (recaptchaToken) {
      return this._http.post(link, data, { headers: new HttpHeaders({ 'recaptcha-token': recaptchaToken }) });
    }
    return this._apiService.post(link, data);
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

  documentStatusDelivered(id: number): Promise<any> {
    return this._apiService.put(`${API_URL}/edi/status-delivered/${id}`).toPromise();
  }

  findCounterpartyDataByInn(inn: string): Observable<CounterpartyResponseModel> {
    return this._apiService.get(`${API_URL}/counterparty/${inn}`);
  }

  findCounterpartiesDataByInns(inns: string[]): Observable<CounterpartyResponseModel[]> {
    const params = this._params({ inn: inns });
    return this._apiService.get(`${API_URL}/counterparty/find-all`, { params });
  }

  getBanners(pageId: string): Observable<BannersListResponseModel> {
    return this._apiService.get(`${API_URL}/banners`, {
      params: new HttpParams().append('pageId', pageId)
    });
  }

  getPageStatic(pageId: string): Observable<PagesStaticListResponseModel> {
    return this._apiService.get(`${API_URL}/pages-static`, {
      params: new HttpParams().append('pageId', pageId)
    });
  }

  getUserRfps(): Observable<RfpListResponseModel> {
    return this._apiService.get(`${API_URL}/rfps`);
  }

  getUserRfpById(id: string): Observable<RfpItemResponseModel> {
    return this._apiService.get(`${API_URL}/rfps/${id}`);
  }

  modifyUserRfpById(id: string, data: any): Observable<any> {
    return this._apiService.patch(`${API_URL}/rfps/${id}`, data);
  }

  updateUserRfpById(id: string, data: any, idempotencyKey: string): Observable<any> {
    return this._apiService.put(`${API_URL}/rfps/${id}`, data, { headers: new HttpHeaders({ 'idempotency-key': idempotencyKey }) });
  }

  createUserRfp(data: RfpItemResponseModel, idempotencyKey: string): Observable<any> {
    return this._apiService.post(`${API_URL}/rfps`, data, { headers: new HttpHeaders({ 'idempotency-key': idempotencyKey }) });
  }

  getUserOffers(query: EdiRequestModel): Observable<DocumentResponseModel[]> {
    const params = this._params(query);
    return this._apiService.get(`${API_URL}/edi/offers`, { params });
  }

  getUserOfferById(id: number): Observable<CommerceOfferMlModel> {
    return this._apiService.get(`${API_URL}/edi/offers/${id}`);
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
