import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NomenclatureCardModel } from '../models';
import { SuggestionModel } from '#shared/modules/common-services/models';
import { BNetService } from '#shared/modules/common-services';

@Injectable()
export class ProductsService {

  constructor(private _bnetService: BNetService) {}

  searchSuggestions(textQuery: string): Observable<SuggestionModel> {
    return this._bnetService.searchSuggestions(textQuery);
  }

  getHistoricalSuggestions(): Observable<SuggestionModel> {
    // TODO: save in localStorage
    return of({
      products: [
        {
          id: 1,
          productName: 'Шишкин лес, 1,5 литра, негаз. <strong>вода</strong>',
          imageUrl: '/assets/img/svg/quick_search_history.svg',
          totalOffers: 137,
        }, {
          id: 2,
          productName: 'Липтон, 2 литра, минеральная <strong>вода</strong>',
          imageUrl: '/assets/img/svg/quick_search_history.svg',
          totalOffers: 64,
        }, {
          id: 3,
          productName: 'Минеральная <strong>вода</strong> "Эвиан", негаз.',
          imageUrl: '/assets/img/svg/quick_search_history.svg',
          totalOffers: 31,
        }, {
          id: 4,
          productName: '<strong>Вода</strong> питьевая Baikal430 негаз., ПЭТ',
          imageUrl: '/assets/img/svg/quick_search_history.svg',
          totalOffers: 26,
        }, {
          id: 5,
          productName: '<strong>Вода</strong> Боржоми, негаз.',
          imageUrl: '/assets/img/svg/quick_search_history.svg',
          totalOffers: 4,
        },
      ],
      categories: [
        {
          categoryId: 1,
          categoryName: 'Продукты питания / Детская <strong>вода</strong>',
          imageUrl: '/assets/img/svg/quick_search_history.svg',
        }, {
          categoryId: 2,
          categoryName: 'Продукты питания / Детская <strong>вода</strong>2',
          imageUrl: '/assets/img/svg/quick_search_history.svg',
        }, {
          categoryId: 3,
          categoryName: 'Продукты питания / Детская <strong>вода</strong>3',
          imageUrl: '/assets/img/svg/quick_search_history.svg',
        }, {
          categoryId: 4,
          categoryName: 'Продукты питания / Детская <strong>вода</strong>',
          imageUrl: '/assets/img/svg/quick_search_history.svg',
        }, {
          categoryId: 5,
          categoryName: 'Продукты питания / Детская <strong>вода</strong>5',
          imageUrl: '/assets/img/svg/quick_search_history.svg',
        },
      ],
    });
  }

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
