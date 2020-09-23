import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { ProductOffersModel, SortModel } from '#shared/modules/common-services/models';
import { ActivatedRoute } from '@angular/router';
import { containParameters } from '#shared/utils';
import { MAX_VALUE } from '#shared/modules/pipes/found.pipe';

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
  @Input() productOffers: ProductOffersModel[];
  @Input() productsTotal: number;
  @Input() page: number;
  @Input() visibleSort = false;
  @Input() sort;
  @Input() templateBanners: TemplateRef<any>;
  @Output() loadProducts: EventEmitter<number> = new EventEmitter();
  @Output() sortingChanged: EventEmitter<SortModel> = new EventEmitter();

  isRequestFulfilled: boolean;

  get foundCount() {
    return this.productsTotal < MAX_VALUE ? this.productsTotal : MAX_VALUE;
  }

  constructor(private _activatedRoute: ActivatedRoute) {
    this._activatedRoute.queryParams.subscribe((queryParams) => {
      this.isRequestFulfilled = containParameters(queryParams);
    });
  }

  productOffersLoading(nextPage: number) {
    this.loadProducts.emit(nextPage);
  }

  sortChange(sort: SortModel) {
    this.sortingChanged.emit(sort);
  }
}
