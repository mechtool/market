import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import {
  SuggestionProductItemModel,
  SuggestionCategoryItemModel,
  AllGroupQueryFiltersModel
} from '#shared/modules/common-services/models';
import { SuggestionService, LocalStorageService } from '#shared/modules/common-services';
import { Router } from '@angular/router';

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
  searchFilters = {};
  useBrowserStorage = true;
  productsSuggestions: SuggestionProductItemModel[];
  categoriesSuggestions: SuggestionCategoryItemModel[];

  constructor(
    private _router: Router,
    private _suggestionService: SuggestionService,
    private _localStorageService: LocalStorageService,
  ) {}

  ngOnInit() {}

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

  navigateToSearchRoute(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    this._router.navigate(['/search'], {
      queryParams: {
        q: filters.query,
        supplier: filters.availableFilters.supplier,
        trademark: filters.availableFilters.trademark,
        delivery: filters.availableFilters.delivery,
        pickup: filters.availableFilters.pickup,
        inStock: filters.availableFilters.inStock,
        onlyWithImages: filters.availableFilters.onlyWithImages,
        priceFrom: filters.availableFilters.priceFrom,
        priceTo: filters.availableFilters.priceTo,
      }
    });
  }

}
