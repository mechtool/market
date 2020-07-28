import { Component } from '@angular/core';
import { of, throwError } from 'rxjs';
import {
  AllGroupQueryFiltersModel,
  DefaultSearchAvailableModel,
  ProductOffersListResponseModel,
  ProductOffersModel,
  SortModel,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LocalStorageService,
  NotificationsService,
  ProductService,
  SuggestionService
} from '#shared/modules/common-services';
import { catchError, switchMap } from 'rxjs/operators';
import { queryParamsFrom } from '#shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  productOffersList: ProductOffersListResponseModel;
  productOffers: ProductOffersModel[];
  productsTotal: number;
  productsSuggestions: SuggestionProductItemModel[];
  categoriesSuggestions: SuggestionCategoryItemModel[];
  availableFilters: DefaultSearchAvailableModel;
  query: string;
  sort: SortModel;
  page: number;
  isLoadingProducts = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductService,
    private _suggestionService: SuggestionService,
    private _router: Router,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
  ) {
    this._init();
  }

  get requestParametersSelected(): boolean {
    return !!this.query ||
      !!(this.availableFilters?.supplierId || this.availableFilters?.trademark || this.availableFilters?.categoryId);
  }


  searchSuggestions(query: string) {
    this._suggestionService.searchSuggestions(query)
      .subscribe((res) => {
        this.productsSuggestions = res.products;
        this.categoriesSuggestions = res.categories;
      }, (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      });
  }

  queryParametersChange(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    this._cleanFilters(filters);
    this._router.navigate(['/search'], {
      queryParams: queryParamsFrom(filters),
    });
  }

  loadProducts(nextPage: number) {
    if (this.requestParametersSelected) {

      if (nextPage === (this.productOffersList.page.number + 1) && nextPage < this.productOffersList.page.totalPages) {
        this.page = nextPage;
        this.isLoadingProducts = true;

        this._productService.searchProductOffers({
          query: this.query,
          availableFilters: this.availableFilters,
          page: nextPage,
          sort: this.sort,
        })
          .subscribe(
            (productOffers) => {
              this.productOffersList = productOffers;
              this.productOffers.push(...this.productOffersList._embedded.productOffers);
              this.productsTotal = this.productOffersList.page.totalElements;
              this.isLoadingProducts = false;
            },
            (err) => {
              this.isLoadingProducts = false;
              this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
            });
      }
    }
  }

  private _init() {
    this._activatedRoute.queryParams
      .pipe(
        switchMap((queryParams) => {
          if (Object.keys(queryParams).length) {
            this.query = queryParams.q;
            this.availableFilters = {
              supplierId: queryParams.supplierId,
              trademark: queryParams.trademark,
              delivery: queryParams.delivery,
              pickup: queryParams.pickup,
              inStock: queryParams.inStock,
              withImages: queryParams.withImages,
              priceFrom: queryParams.priceFrom,
              priceTo: queryParams.priceTo,
              categoryId: queryParams.categoryId,
            };
            this.sort = queryParams.sort;
          }
          return of({
            query: this.query,
            availableFilters: this.availableFilters,
            sort: this.sort,
          });
        }),
        switchMap((filters) => {
          if (this.requestParametersSelected) {
            return this._productService.searchProductOffers(filters);
          }
          return of(new ProductOffersListResponseModel());
        }),
        catchError((err) => {
          return throwError(err);
        })
      )
      .subscribe((productOffers) => {
        this.productOffersList = productOffers;
        this.productOffers = this.productOffersList._embedded?.productOffers || [];
        this.productsTotal = this.productOffersList.page?.totalElements || 0;
        this.page = this.productOffersList.page?.number || 0;
      }, (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      });
  }


  private _cleanFilters(filters: AllGroupQueryFiltersModel) {
    if (!filters?.query) {
      this.query = null;
    }
    if (!filters?.availableFilters) {
      this.availableFilters = null;
    }
  }
}