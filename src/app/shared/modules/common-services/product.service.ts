import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NomenclatureCardModel } from './models';
import { BNetService } from './bnet.service';

@Injectable()
export class ProductService {

  constructor(private _bnetService: BNetService) {}

  getPopularNomenclatureCards(): Observable<NomenclatureCardModel[]> {
    return this._bnetService.searchNomenclatures({ suppliers: ['23b975fe-3cce-4b72-bde6-90c255759aff'] })
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

}
