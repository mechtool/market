import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  AllGroupQueryFiltersModel,
  ProductOffersCardModel,
  ProductOfferResponseModel,
  ProductOfferRequestModel, ProductOffersCardWithProductsTotalModel
} from './models';
import { BNetService } from './bnet.service';

@Injectable()
export class ProductService {

  constructor(private _bnetService: BNetService) {
  }

  getNomenclature(id: string, filterQuery?: ProductOfferRequestModel): Observable<ProductOfferResponseModel> {
    return this._bnetService.getNomenclature(id, filterQuery);
  }

  getPopularProductOffers(): Observable<ProductOffersCardWithProductsTotalModel> {
    return this._bnetService.searchNomenclatures({ categoryId: '3335', onlyWithImages: true })
      .pipe(
        map((productOffers) => {
          const products = new ProductOffersCardWithProductsTotalModel();
          products.productOffers = productOffers?._embedded.productOffers.map((productOffer) => {
            const product = productOffer.product;
            return new ProductOffersCardModel({
              id: product.id,
              productName: product.productName,
              imageUrl: product.images?.[0].href,
              offersSummary: {
                minPrice: productOffer.offersMinPrice,
                totalOffers: productOffer.offersTotal,
              },
            });
          });
          products.productsTotal = productOffers?.page?.totalElements;
          return products;
        })
      );
  }

  searchProductOffers(filters: AllGroupQueryFiltersModel): Observable<ProductOffersCardWithProductsTotalModel> {
    const searchQuery = {
      q: filters.query,
      categoryId: filters.categoryId,
      priceFrom: filters.availableFilters.priceFrom,
      priceTo: filters.availableFilters.priceTo,
      suppliers: [filters.availableFilters.supplier],
      tradeMarks: [filters.availableFilters.trademark],
      inStock: filters.availableFilters.inStock,
      onlyWithImages: filters.availableFilters.onlyWithImages,
      deliveryArea: filters.availableFilters.delivery,
      pickupArea: filters.availableFilters.pickup,
      sort: filters.sort,
    };

    return this._bnetService.searchNomenclatures(searchQuery)
      .pipe(
        map((productOffers) => {
          const products = new ProductOffersCardWithProductsTotalModel();
          products.productOffers = productOffers?._embedded.productOffers.map((productOffer) => {
            const product = productOffer.product;
            return new ProductOffersCardModel({
              id: product.id,
              productName: product.productName,
              imageUrl: product.images?.[0].href,
              offersSummary: {
                minPrice: productOffer.offersMinPrice,
                totalOffers: productOffer.offersTotal,
              },
            });
          });
          products.productsTotal = productOffers?.page?.totalElements;
          return products;
        })
      );
  }

}
