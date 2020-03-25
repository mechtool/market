import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NomenclatureCardModel } from './models';
import { BNetService } from './bnet.service';

@Injectable()
export class ProductService {

  constructor(private _bnetService: BNetService) {}

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

  searchNomenclatureCards(): Observable<any> {
    // TODO: params
    return this._bnetService.searchNomenclatures({})
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
