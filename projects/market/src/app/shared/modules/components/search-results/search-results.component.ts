import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CategoryModel, ProductOffersModel, SortModel } from '#shared/modules/common-services/models';
import { ActivatedRoute } from '@angular/router';
import { containParameters } from '#shared/utils';
import { MAX_VALUE } from '#shared/modules/pipes/found.pipe';
import { combineLatest } from 'rxjs';
import { CategoryService, NavigationService, SpinnerService } from '#shared/modules/common-services';
import { IPageInfo, VirtualScrollerComponent } from 'ngx-virtual-scroller';

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
export class SearchResultComponent implements AfterViewInit {
  @Input() category: CategoryModel;
  @Input() productOffers: ProductOffersModel[];
  @Input() productsTotal: number;
  @Input() page: number;
  @Input() pageSize = 30;
  @Input() visibleSort = false;
  @Input() sort;

  @Output() sortingChanged: EventEmitter<SortModel> = new EventEmitter();
  @Output() positionChanged: EventEmitter<{ pos: number; page: number }> = new EventEmitter();

  @ViewChild(VirtualScrollerComponent) private virtualScroller: VirtualScrollerComponent;

  isRequestFulfilled: boolean;
  queryParams: any;
  private unlocked = false;

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
    private _spinnerService: SpinnerService,
    private _navigationService: NavigationService,
  ) {
    combineLatest([this._activatedRoute.params, this._activatedRoute.queryParams]).subscribe(([params, queryParams]) => {
      this.isRequestFulfilled = containParameters(queryParams);
      this.queryParams = queryParams;
    });
  }

  ngAfterViewInit(): void {
    const index = +this._activatedRoute.snapshot.queryParamMap.get('pos');
    if (index) {
      this._scrollToIndex(index, 200).then(() => setTimeout(() => {
          this.unlocked = true;
        }, 1500)
      );
    } else {
      this.unlocked = true;
    }
  }

  sortChange(sort: SortModel) {
    this.sortingChanged.emit(sort);
  }

  loadProducts(event: IPageInfo) {
    if (this.unlocked) {
      const nextPage = Math.floor((event.endIndex + 1) / this.pageSize);
      this.positionChanged.emit({ pos: event.startIndex, page: nextPage })
    }
  }

  private async _scrollToIndex(index: number, logout: number) {
    if (logout < 0) {
      return;
    }

    if (this.virtualScroller) {
      this.virtualScroller.scrollToIndex(index);
      return;
    }

    await this._sleep(10).then(() => this._scrollToIndex(index, --logout));
  }

  private _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
