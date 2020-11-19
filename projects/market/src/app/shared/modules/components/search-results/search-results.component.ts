import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryModel, ProductOffersModel, SortModel } from '#shared/modules/common-services/models';
import { ActivatedRoute } from '@angular/router';
import { containParameters } from '#shared/utils';
import { MAX_VALUE } from '#shared/modules/pipes/found.pipe';
import { combineLatest } from 'rxjs';
import { CategoryService } from '#shared/modules/common-services';

@Component({
  selector: 'market-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: [
    './search-results.component.scss',
    './search-results.component-992.scss',
    './search-results.component-768.scss',
    './search-results.component-576.scss',
  ],
})
export class SearchResultComponent {
  @Input() category: CategoryModel;
  @Input() productOffers: ProductOffersModel[];
  @Input() productsTotal: number;
  @Input() page: number;
  @Input() visibleSort = false;
  @Input() sort;
  @Output() loadProducts: EventEmitter<number> = new EventEmitter();
  @Output() sortingChanged: EventEmitter<SortModel> = new EventEmitter();

  isRequestFulfilled: boolean;
  queryParams: any;

  get showResult() {
    if (this.productOffers?.length) {
      return 'notEmptyResults';
    }
    if (this.category && this.isRequestFulfilled) {
      return 'emptyResultsAndCategoryPage';
    }
    if (this.isRequestFulfilled) {
      return 'emptyResults';
    }
  }

  get foundCount() {
    return this.productsTotal < MAX_VALUE ? this.productsTotal : MAX_VALUE;
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _categoryService: CategoryService,
  ) {

    combineLatest([this._activatedRoute.params, this._activatedRoute.queryParams])
      .subscribe(([params, queryParams]) => {
        this.isRequestFulfilled = containParameters(queryParams);
        this.queryParams = queryParams;
      });
  }

  productOffersLoading(nextPage: number) {
    this.loadProducts.emit(nextPage);
  }

  sortChange(sort: SortModel) {
    this.sortingChanged.emit(sort);
  }
}
