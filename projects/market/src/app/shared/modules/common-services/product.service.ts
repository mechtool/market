import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  AllGroupQueryFiltersModel,
  CountryCode,
  ProductOfferRequestModel,
  ProductOfferResponseModel,
  ProductOffersListResponseModel
} from './models';
import { BNetService } from './bnet.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class ProductService {

  constructor(
    private _bnetService: BNetService,
    private _localStorageService: LocalStorageService,
  ) {
  }

  getProductOffer(id: string, query?: ProductOfferRequestModel): Observable<ProductOfferResponseModel> {
    return this._bnetService.getProductOffer(id, query);
  }

  getPopularProductOffers(): Observable<ProductOffersListResponseModel> {
    return this._bnetService.getPopularProducts();
  }

  searchProductOffers(groupQuery: AllGroupQueryFiltersModel): Observable<ProductOffersListResponseModel> {
    const fias = this._fias();
    const searchQuery = {
      q: groupQuery.query,
      categoryId: groupQuery.filters?.categoryId,
      priceFrom: groupQuery.filters?.priceFrom ? groupQuery.filters.priceFrom * 100 : undefined,
      priceTo: groupQuery.filters?.priceTo ? groupQuery.filters.priceTo * 100 : undefined,
      suppliers: [groupQuery.filters?.supplierId],
      tradeMarks: [groupQuery.filters?.trademark],
      inStock: groupQuery.filters?.inStock,
      withImages: groupQuery.filters?.withImages,
      deliveryArea: groupQuery.filters?.isDelivery ? fias : undefined,
      pickupArea: groupQuery.filters?.isPickup ? fias : undefined,
      page: groupQuery.page,
      sort: groupQuery.sort,
    };

    return this._bnetService.searchProductOffers(searchQuery);
  }

  private _fias() {
    return this._localStorageService.getUserLocation()?.fias === CountryCode.RUSSIA ?
      undefined : this._localStorageService.getUserLocation()?.fias;
  }
}
