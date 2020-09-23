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
  SpinnerService,
  SuggestionService,
} from '#shared/modules/common-services';
import { catchError, switchMap } from 'rxjs/operators';
import { hasRequiredParameters, queryParamsFrom } from '#shared/utils';

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
  filters: DefaultSearchAvailableModel;
  query: string;
  sort: SortModel;
  page: number;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductService,
    private _suggestionService: SuggestionService,
    private _router: Router,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
    private _spinnerService: SpinnerService,
  ) {
    this._init();
  }

  get requestParametersSelected(): boolean {
    return hasRequiredParameters({ query: this.query, filters: this.filters });
  }

  searchSuggestions(query: string) {
    this._suggestionService.searchSuggestions(query).subscribe(
      (res) => {
        this.productsSuggestions = res.products;
        this.categoriesSuggestions = res.categories;
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  loadProducts(nextPage: number) {
    if (this.requestParametersSelected) {
      if (nextPage === this.productOffersList.page.number + 1 && nextPage < this.productOffersList.page.totalPages) {
        this.page = nextPage;
        this._spinnerService.show();

        this._productService
          .searchProductOffers({
            query: this.query,
            filters: this.filters,
            page: nextPage,
            sort: this.sort,
          })
          .subscribe(
            (productOffers) => {
              this.productOffersList = productOffers;
              this.productOffers.push(...this.productOffersList._embedded.productOffers);
              this.productsTotal = this.productOffersList.page.totalElements;
              this._spinnerService.hide();
            },
            (err) => {
              this._spinnerService.hide();
              this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
            },
          );
      }
    }
  }

  changeQueryParamsAndRefresh(groupQuery: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(groupQuery.query);
    this.addOrRemoveSorting(groupQuery);
    const params = queryParamsFrom(groupQuery);
    this._router.navigate(['/search'], {
      queryParams: params,
    });
  }

  changeCityAndRefresh(isChanged: boolean) {
    if (isChanged) {
      this._init();
    }
  }

  changeSortingAndRefresh(sort: SortModel) {
    this.sort = sort;
    this.changeQueryParamsAndRefresh({
      query: this.query,
      filters: this.filters,
      sort: this.sort,
    });
  }

  private _init() {
    this._activatedRoute.queryParams
      .pipe(
        switchMap((queryParams) => {
          this._spinnerService.show();
          this.query = queryParams.q;
          this.filters = {
            supplierId: queryParams.supplierId,
            trademark: queryParams.trademark,
            isDelivery: queryParams.isDelivery !== 'false',
            isPickup: queryParams.isPickup !== 'false',
            inStock: queryParams.inStock,
            withImages: queryParams.withImages,
            priceFrom: queryParams.priceFrom,
            priceTo: queryParams.priceTo,
            categoryId: queryParams.categoryId,
          };
          this.sort = queryParams.sort;
          return of({
            query: this.query,
            filters: this.filters,
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
        }),
      )
      .subscribe(
        (productOffers) => {
          this.productOffersList = productOffers;
          this.productOffers = this.productOffersList._embedded?.productOffers || [];
          this.productsTotal = this.productOffersList.page?.totalElements || 0;
          this.page = this.productOffersList.page?.number || 0;
          this._spinnerService.hide();
        },
        (err) => {
          this._spinnerService.hide();
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private addOrRemoveSorting(groupQuery: AllGroupQueryFiltersModel) {
    if (hasRequiredParameters(groupQuery)) {
      groupQuery.sort = this.sort;
    }
  }
}
