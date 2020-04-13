import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from '#shared/modules/common-services/product.service';
import {
  AllGroupQueryFiltersModel,
  NomenclatureCardModel,
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
  query: string;

  constructor(private _route: ActivatedRoute,
              private _productService: ProductService,
              private _suggestionService: SuggestionService,
              private _router: Router,
              private _localStorageService: LocalStorageService,
              private _breadcrumbsService: BreadcrumbsService,
  ) {
    this._route.queryParams.subscribe((res) => {
      this.query = res.q;
      const searchFilters = {
        supplier: res.supplier,
        trademark: res.trademark,
        delivery: res.delivery,
        pickup: res.pickup,
        inStock: res.inStock,
        onlyWithImages: res.onlyWithImages,
        priceFrom: res.priceFrom,
        priceTo: res.priceTo,
      };
      this.searchNomenclatures({ query: this.query, availableFilters: searchFilters });
    });
    this._breadcrumbsService.setVisible(false);
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

  searchNomenclatures(filters: AllGroupQueryFiltersModel): void {
    this._productService.searchNomenclatureCards(filters)
      .subscribe((res) => {
        this.searchedNomenclatures = res._embedded.items;
        this.totalSearchedNomenclaturesCount = res.page?.totalElements;
      }, (err) => {
        console.log('error');
      });
  }

  navigateToSearchRoute(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    const availableFilters = filters.availableFilters;
    this._router.navigate(['/search'], {
      queryParams: {
        q: filters.query,
        supplier: availableFilters.supplier,
        trademark: availableFilters.trademark,
        delivery: availableFilters.delivery,
        pickup: availableFilters.pickup,
        inStock: availableFilters.inStock,
        onlyWithImages: availableFilters.onlyWithImages,
        priceFrom: availableFilters.priceFrom,
        priceTo: availableFilters.priceTo,
      }
    });
  }

}
