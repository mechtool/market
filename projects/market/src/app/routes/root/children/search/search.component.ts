import { Component } from '@angular/core';
import {
  AllGroupQueryFiltersModel,
  DefaultSearchAvailableModel,
  SortModel,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService, NotificationsService, SuggestionService, } from '#shared/modules/common-services';
import { hasRequiredParameters, queryParamsFrom } from '#shared/utils';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  page: number;
  query: string;
  sort: SortModel;
  visibleBanners: boolean;
  filters: DefaultSearchAvailableModel;
  categoriesSuggestions: SuggestionCategoryItemModel[];
  productsSuggestions: SuggestionProductItemModel[];

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _suggestionService: SuggestionService,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
  ) {
    this._init();
  }

  searchSuggestions(query: string) {
    this._suggestionService.searchSuggestions(query)
      .subscribe((res) => {
          this.productsSuggestions = res.products;
          this.categoriesSuggestions = res.categories;
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  changeQueryParamsAndRefresh(groupQuery: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(groupQuery.query);
    this._addOrRemoveSorting(groupQuery);
    this._addOrRemovePage(groupQuery);
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
      page: this.page,
    });
  }

  changePage(page: number) {
    this.page = page;
    this.changeQueryParamsAndRefresh({
      query: this.query,
      filters: this.filters,
      sort: this.sort,
      page: this.page,
    });
  }

  changeVisibleBanners(visibleBanners: boolean) {
    this.visibleBanners = visibleBanners;
  }

  private _init() {
    this._activatedRoute.queryParams
      .subscribe((queryParams) => {
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
          this.page = queryParams.page || 0;
        },
      );
  }

  private _addOrRemoveSorting(groupQuery: AllGroupQueryFiltersModel) {
    if (hasRequiredParameters(groupQuery)) {
      groupQuery.sort = this.sort;
    }
  }

  private _addOrRemovePage(groupQuery: AllGroupQueryFiltersModel) {
    if (hasRequiredParameters(groupQuery)) {
      groupQuery.page = this.page;
    }
  }
}
