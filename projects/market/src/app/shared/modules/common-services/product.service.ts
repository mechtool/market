import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AllGroupQueryFiltersModel, CountryCode, ProductOfferResponseModel, ProductOffersListResponseModel } from './models';
import { BNetService } from './bnet.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class ProductService {
  constructor(private _bnetService: BNetService, private _localStorageService: LocalStorageService) {}

  getProductOffer(id: string, isConsiderLocation: boolean = false): Observable<ProductOfferResponseModel> {
    const fias = this._fias();
    if (fias && isConsiderLocation) {
      return this._bnetService.getProductOffer(id, { pickupArea: fias, deliveryArea: fias });
    }
    return this._bnetService.getProductOffer(id, {});
  }

  getPopularProductOffers(categoryId?: string): Observable<ProductOffersListResponseModel> {
    return this._bnetService.getPopularProducts(categoryId);
  }

  searchProductOffers(groupQuery: AllGroupQueryFiltersModel, cacheable = true): Observable<ProductOffersListResponseModel> {
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
      hasDiscount: groupQuery.filters?.hasDiscount,
      deliveryArea: groupQuery.filters?.isDelivery ? fias : undefined,
      pickupArea: groupQuery.filters?.isPickup ? fias : undefined,
      page: groupQuery.page,
      size: groupQuery.size,
      sort: groupQuery.sort,
    };

    return this._bnetService.searchProductOffers(searchQuery, cacheable);
  }

  private _fias() {
    return this._localStorageService.getUserLocation()?.fias === CountryCode.RUSSIA
      ? undefined
      : this._localStorageService.getUserLocation()?.fias;
  }
}
