import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
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

  constructor(private _route: ActivatedRoute,
              private _productService: ProductService,
              private _suggestionService: SuggestionService,
              private _router: Router,
              private _localStorageService: LocalStorageService,
              private _breadcrumbsService: BreadcrumbsService,
  ) {
    this._initBreadcrumbs();
    this._initQueryParams();
    this._searchNomenclatures({
      query: this.query,
      availableFilters: this.availableFilters,
      sort: this.sort,
    });
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
    }

    return queryParams;
  }


  private _searchNomenclatures(filters: AllGroupQueryFiltersModel): void {
    let productOffers;
    if (filters.query === undefined && filters.availableFilters === undefined) {
      // todo Если пользователь напрямую перешел в поиск, то параметры пустые, поэтому показываем популярные товары
      productOffers = this._productService.getPopularProductOffers();
    } else {
      productOffers = this._productService.searchProductOffers(filters);
    }
    productOffers.subscribe((products) => {
      this.productOffers = products.productOffers;
      this.productsTotal = products.productsTotal;
    }, (err) => {
      console.log('error');
    });
  }

  private _initQueryParams() {
    this._route.queryParams.subscribe((queryParams) => {
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
        };
        this.sort = queryParams.sort;
      }
    });
  }

  private _initBreadcrumbs() {
    this._breadcrumbsService.setVisible(false);
  }
}
