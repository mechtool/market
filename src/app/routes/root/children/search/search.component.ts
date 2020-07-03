import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { ProductService } from '#shared/modules/common-services/product.service';
import {
  AllGroupQueryFiltersModel,
  DefaultSearchAvailableModel,
  ProductOffersCardModel,
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
  productOffers: ProductOffersCardModel[];
  productsTotal: number;
  productsSuggestions: SuggestionProductItemModel[];
  categoriesSuggestions: SuggestionCategoryItemModel[];
  availableFilters: DefaultSearchAvailableModel;
  query: string;
  sort: SortModel;

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
      .subscribe((products) => {
        this._initBreadcrumbs();
        this.productOffers = products.productOffers;
        this.productsTotal = products.productsTotal;
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
