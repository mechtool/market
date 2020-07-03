import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  AllGroupQueryFiltersModel,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
} from '#shared/modules/common-services/models';
import { LocalStorageService, SuggestionService } from '#shared/modules/common-services';
import { Router } from '@angular/router';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'my-main',
  templateUrl: './main.component.html',
  styleUrls: [
    './main.component.scss',
    './main.component-768.scss'
  ],
})
export class MainComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  productsSuggestions: SuggestionProductItemModel[];
  categoriesSuggestions: SuggestionCategoryItemModel[];

  constructor(
    private _router: Router,
    private _suggestionService: SuggestionService,
    private _localStorageService: LocalStorageService,
    private _breadcrumbsService: BreadcrumbsService,
  ) {
    this._breadcrumbsService.setVisible(false);
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
        console.error('error', err);
      });
  }

  navigateToSearchRoute(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    this._router.navigate(['/search'], {
      queryParams: {
        q: filters.query,
        supplier: filters.availableFilters?.supplier,
        trademark: filters.availableFilters?.trademark,
        deliveryMethod: filters.availableFilters?.deliveryMethod,
        delivery: filters.availableFilters?.delivery,
        pickup: filters.availableFilters?.pickup,
        inStock: filters.availableFilters?.inStock,
        withImages: filters.availableFilters?.withImages,
        priceFrom: filters.availableFilters?.priceFrom,
        priceTo: filters.availableFilters?.priceTo,
        categoryId: filters.availableFilters?.categoryId,
        sort: filters.sort,
      }
    });
  }
}
