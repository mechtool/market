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

  getPopularProductOffers(): Observable<ProductOffersListResponseModel> {
    return this._bnetService.getPopularProducts();
  }

  searchProductOffers(groupQuery: AllGroupQueryFiltersModel, cacheable = true): Observable<ProductOffersListResponseModel> {
    const fias = this._fias();
    const searchQuery = {
      q: groupQuery.query?.length > 100 ? groupQuery.query.slice(0, 100) : groupQuery.query,
      categoryId: groupQuery.filters?.categoryId,
      priceFrom: groupQuery.filters?.priceFrom ? groupQuery.filters.priceFrom * 100 : undefined,
      priceTo: groupQuery.filters?.priceTo ? groupQuery.filters.priceTo * 100 : undefined,
      suppliers: [groupQuery.filters?.supplierId],
      tradeMarks: [groupQuery.filters?.tradeMark],
      inStock: groupQuery.filters?.inStock,
      withImages: groupQuery.filters?.withImages,
      hasDiscount: groupQuery.filters?.hasDiscount,
      features: groupQuery.filters.features,
      deliveryArea: groupQuery.filters?.isDelivery === false ? undefined : fias,
      pickupArea: groupQuery.filters?.isPickup === false ? undefined : fias,
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
