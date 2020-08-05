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

@Injectable()
export class ProductService {

  constructor(private _bnetService: BNetService) {
  }

  getProductOffer(id: string, filterQuery?: ProductOfferRequestModel): Observable<ProductOfferResponseModel> {
    return this._bnetService.getProductOffer(id, filterQuery);
  }

  getPopularProductOffers(): Observable<ProductOffersListResponseModel> {
    return this._bnetService.getPopularProducts();
  }

  searchProductOffers(filters: AllGroupQueryFiltersModel): Observable<ProductOffersListResponseModel> {
    const delivery = filters.availableFilters?.delivery === CountryCode.RUSSIA ? undefined : filters.availableFilters?.delivery;
    const pickup = filters.availableFilters?.pickup === CountryCode.RUSSIA ? undefined : filters.availableFilters?.pickup;
    const searchQuery = {
      q: filters.query,
      categoryId: filters.availableFilters?.categoryId,
      priceFrom: filters.availableFilters?.priceFrom,
      priceTo: filters.availableFilters?.priceTo,
      suppliers: [filters.availableFilters?.supplierId],
      tradeMarks: [filters.availableFilters?.trademark],
      inStock: filters.availableFilters?.inStock,
      withImages: filters.availableFilters?.withImages,
      deliveryArea: delivery,
      pickupArea: pickup,
      page: filters.page,
      sort: filters.sort,
    };

    return this._bnetService.searchProductOffers(searchQuery);
  }
}
