import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { SuggestResponseModel } from '../models';

const MIN_QUERY_LENGTH = 3;

@Injectable()
export class ProductsService {

  constructor() {}

  getSuggestions(query: string): Observable<SuggestResponseModel> {
    if (query.length < MIN_QUERY_LENGTH) {
      return of({
        products: null,
        categories: null,
      });
    }
    if (query.length >= MIN_QUERY_LENGTH) {
      return of({
        products: [
          {
            title: 'Шишкин лес, 1,5 литра, негаз. <strong>вода</strong>',
            imgUrl: '/assets/img/tmp/quick_1.png',
            offersCount: 137,
            id: 1
          }, {
            title: 'Липтон, 2 литра, минеральная <strong>вода</strong>',
            imgUrl: '/assets/img/tmp/quick_2.png',
            offersCount: 64,
            id: 2
          }, {
            title: 'Минеральная <strong>вода</strong> "Эвиан", негаз.',
            imgUrl: '/assets/img/tmp/quick_3.png',
            offersCount: 31,
            id: 3
          }, {
            title: '<strong>Вода</strong> питьевая Baikal430 негаз., ПЭТ',
            imgUrl: '/assets/img/tmp/quick_4.png',
            offersCount: 26,
            id: 4
          }, {
            title: '<strong>Вода</strong> Боржоми, негаз.',
            imgUrl: '/assets/img/tmp/quick_5.png',
            offersCount: 4,
            id: 5
          },
        ],
        categories: [
          {
            title: 'Продукты питания / Детская <strong>вода</strong>',
            imgUrl: '/assets/img/tmp/quick_6.png',
            id: 1
          }, {
            title: 'Продукты питания / Детская <strong>вода</strong>2',
            imgUrl: '/assets/img/tmp/quick_6.png',
            id: 2
          }, {
            title: 'Продукты питания / Детская <strong>вода</strong>3',
            imgUrl: '/assets/img/tmp/quick_6.png',
            id: 3
          }, {
            title: 'Продукты питания / Детская <strong>вода</strong>4',
            imgUrl: '/assets/img/tmp/quick_6.png',
            id: 4
          }, {
            title: 'Продукты питания / Детская <strong>вода</strong>5',
            imgUrl: '/assets/img/tmp/quick_6.png',
            id: 5
          }
        ],
      });
    }
  }

  getHistoricalSuggestions(): Observable<SuggestResponseModel> {
    return of({
      products: [
        {
          title: 'Шишкин лес, 1,5 литра, негаз. <strong>вода</strong>',
          imgUrl: '/assets/img/svg/quick_search_history.svg',
          offersCount: 137,
          id: 1
        }, {
          title: 'Липтон, 2 литра, минеральная <strong>вода</strong>',
          imgUrl: '/assets/img/svg/quick_search_history.svg',
          offersCount: 64,
          id: 2
        }, {
          title: 'Минеральная <strong>вода</strong> "Эвиан", негаз.',
          imgUrl: '/assets/img/svg/quick_search_history.svg',
          offersCount: 31,
          id: 3
        }, {
          title: '<strong>Вода</strong> питьевая Baikal430 негаз., ПЭТ',
          imgUrl: '/assets/img/svg/quick_search_history.svg',
          offersCount: 26,
          id: 4
        }, {
          title: '<strong>Вода</strong> Боржоми, негаз.',
          imgUrl: '/assets/img/svg/quick_search_history.svg',
          offersCount: 4,
          id: 5
        },
      ],
      categories: [
        {
          title: 'Продукты питания / Детская <strong>вода</strong>',
          imgUrl: '/assets/img/svg/quick_search_history.svg',
          id: 1
        }, {
          title: 'Продукты питания / Детская <strong>вода</strong>',
          imgUrl: '/assets/img/svg/quick_search_history.svg',
          id: 2
        }, {
          title: 'Продукты питания / Детская <strong>вода</strong>',
          imgUrl: '/assets/img/svg/quick_search_history.svg',
          id: 3
        }, {
          title: 'Продукты питания / Детская <strong>вода</strong>',
          imgUrl: '/assets/img/svg/quick_search_history.svg',
          id: 4
        }, {
          title: 'Продукты питания / Детская <strong>вода</strong>',
          imgUrl: '/assets/img/svg/quick_search_history.svg',
          id: 5
        }
      ],
    });
  }

}
