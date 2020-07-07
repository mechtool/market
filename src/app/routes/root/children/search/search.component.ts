import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { ProductService } from '#shared/modules/common-services/product.service';
import {
  AllGroupQueryFiltersModel,
  DefaultSearchAvailableModel,
  ProductOffersListResponseModel,
  ProductOffersModel,
  SortModel,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
} from '#shared/modules/common-services/models';
import { SuggestionService } from '#shared/modules/common-services/suggestion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '#shared/modules/common-services/local-storage.service';
import { BreadcrumbsService } from '../../components/breadcrumbs/breadcrumbs.service';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
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

  constructor(private _activatedRoute: ActivatedRoute,
              private _productService: ProductService,
              private _suggestionService: SuggestionService,
              private _router: Router,
              private _localStorageService: LocalStorageService,
              private _breadcrumbsService: BreadcrumbsService,
  ) {
    this._init();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  searchSuggestions(query: string) {
    this._suggestionService.searchSuggestions(query)
      .subscribe((res) => {
        this.productsSuggestions = res.products;
        this.categoriesSuggestions = res.categories;
      }, (err) => {
        console.log('error');
      });
  }

  queryParametersChange(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    this._router.navigate(['/search'], {
      queryParams: this._getQueryParams(filters)
    });
  }

  loadProducts(nextPage: number) {
    if (this.query || this.availableFilters) {

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
              console.error('error', err);
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
              supplier: queryParams.supplier,
              trademark: queryParams.trademark,
              deliveryMethod: queryParams.deliveryMethod,
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
          if (filters.query === undefined && filters.availableFilters === undefined) {
            return this._productService.getPopularProductOffers();
          }
          return this._productService.searchProductOffers(filters);
        }),
        catchError((err) => {
          console.error('error', err);
          return throwError(err);
        })
      )
      .subscribe((productOffers) => {
        this._initBreadcrumbs();
        this.productOffersList = productOffers;
        this.productOffers = this.productOffersList._embedded.productOffers;
        this.productsTotal = this.productOffersList.page.totalElements;
        this.page = this.productOffersList.page.number;
      }, (err) => {
        console.log('error');
      });
  }

  private _getQueryParams(filters: AllGroupQueryFiltersModel) {
    const queryParams: any = {};
    const availableFilters = filters.availableFilters;

    queryParams.q = filters.query;
    queryParams.sort = filters.sort;

    if (availableFilters) {
      queryParams.supplier = availableFilters.supplier;
      queryParams.trademark = availableFilters.trademark;
      queryParams.deliveryMethod = availableFilters.deliveryMethod;
      queryParams.delivery = availableFilters.delivery;
      queryParams.pickup = availableFilters.pickup;
      queryParams.inStock = availableFilters.inStock;
      queryParams.withImages = availableFilters.withImages;
      queryParams.priceFrom = availableFilters.priceFrom;
      queryParams.priceTo = availableFilters.priceTo;
      queryParams.categoryId = availableFilters.categoryId;
    }

    return queryParams;
  }

  private _initBreadcrumbs() {
    this._breadcrumbsService.setVisible(false);
  }
}
