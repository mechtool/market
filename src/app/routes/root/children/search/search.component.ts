import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from '#shared/modules/common-services/product.service';
import {
  AllGroupQueryFiltersModel,
  DefaultSearchAvailableModel,
  NomenclatureCardModel,
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
  searchedNomenclatures: NomenclatureCardModel[];
  totalSearchedNomenclaturesCount: number;
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

  searchSuggestions(e: string) {
    this._suggestionService.searchSuggestions(e)
      .subscribe((res) => {
        this.productsSuggestions = res.products;
        this.categoriesSuggestions = res.categories;
      }, (err) => {
        console.log('error');
      });
  }

  queryParametersChange(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    const availableFilters = filters.availableFilters;
    this._router.navigate(['/search'], {
      queryParams: {
        q: filters.query,
        supplier: availableFilters.supplier,
        trademark: availableFilters.trademark,
        deliveryMethod: availableFilters.deliveryMethod,
        delivery: availableFilters.delivery,
        pickup: availableFilters.pickup,
        inStock: availableFilters.inStock,
        onlyWithImages: availableFilters.onlyWithImages,
        priceFrom: availableFilters.priceFrom,
        priceTo: availableFilters.priceTo,
        sort: filters.sort,
      }
    });
  }

  private _searchNomenclatures(filters: AllGroupQueryFiltersModel): void {
    this._productService.searchNomenclatureCards(filters)
      .subscribe((res) => {
        this.searchedNomenclatures = res._embedded.items;
        this.totalSearchedNomenclaturesCount = res.page?.totalElements;
      }, (err) => {
        console.log('error');
      });
  }

  private _initQueryParams() {
    this._route.queryParams.subscribe((queryParams) => {
      this.query = queryParams.q;
      this.availableFilters = {
        supplier: queryParams.supplier,
        trademark: queryParams.trademark,
        deliveryMethod: queryParams.deliveryMethod,
        delivery: queryParams.delivery,
        pickup: queryParams.pickup,
        inStock: queryParams.inStock,
        onlyWithImages: queryParams.onlyWithImages,
        priceFrom: queryParams.priceFrom,
        priceTo: queryParams.priceTo,
      };
      this.sort = queryParams.sort;
    });
  }

  private _initBreadcrumbs() {
    this._breadcrumbsService.setVisible(false);
  }
}
