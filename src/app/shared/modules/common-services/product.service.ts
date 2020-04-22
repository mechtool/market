import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AllGroupQueryFiltersModel, NomenclatureCardModel, NomenclatureModel } from './models';
import { BNetService } from './bnet.service';

@Injectable()
export class ProductService {

  constructor(private _bnetService: BNetService) {
  }

  getNomenclature(id: string): Observable<NomenclatureModel> {
    return this._bnetService.getNomenclature(id);
  }

  getPopularNomenclatureCards(): Observable<NomenclatureCardModel[]> {
    return this._bnetService.searchNomenclatures({ priceFrom: 1 })
      .pipe(
        map((res) => {
          return res?._embedded?.items?.map((nom) => {
            return new NomenclatureCardModel({
              id: nom.id,
              productName: nom.productName,
              imageUrl: nom.imageUrls?.[0],
              offersSummary: {
                minPrice: nom.offersSummary.minPrice,
                totalOffers: nom.offersSummary.totalOffers,
              },
            });
          });
        })
      );
  }

  searchNomenclatureCards(filters: AllGroupQueryFiltersModel): Observable<any> {
    const searchQuery = {
      textQuery: filters.query,
      categoryId: filters.categoryId,
      priceFrom: filters.availableFilters.priceFrom,
      priceTo: filters.availableFilters.priceTo,
      suppliers: [filters.availableFilters.supplier],
      tradeMarks: [filters.availableFilters.trademark],
      onlyInStock: filters.availableFilters.inStock,
      onlyWithImages: filters.availableFilters.onlyWithImages,
      deliveryLocationFiasCode: filters.availableFilters.delivery,
      pickupLocationFiasCode: filters.availableFilters.pickup,
      sort: filters.sort,
    };

    return this._bnetService.searchNomenclatures(searchQuery)
      .pipe(
        map((res) => {
          // TODO
          const data = JSON.parse(JSON.stringify(res));
          data._embedded.items = res?._embedded?.items?.map((nom) => {
            return new NomenclatureCardModel({
              id: nom.id,
              productName: nom.productName,
              imageUrl: nom.imageUrls?.[0],
              offersSummary: {
                minPrice: nom.offersSummary.minPrice,
                totalOffers: nom.offersSummary.totalOffers,
              },
            });
          });
          return data;
        })
      );
  }

}
