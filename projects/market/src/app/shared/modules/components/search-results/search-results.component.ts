import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { CategoryModel, ProductOffersModel, SortModel } from '#shared/modules/common-services/models';
import { MAX_VALUE } from '#shared/modules/pipes/found.pipe';
import { IPageInfo, VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { Location } from '@angular/common';
import { SearchResultsService } from './search-results.service';
import { Subscription } from 'rxjs';
import { unsubscribeList } from '#shared/utils';
import { ActivatedRoute } from '@angular/router';

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
export class SearchResultComponent implements OnDestroy {
  queryParams: any;
  isRequestFulfilled: boolean;

  @Input() category: CategoryModel;
  @Input() productOffers: ProductOffersModel[];
  @Input() productsTotal: number;
  @Input() page: number;
  @Input() pageSize = 60;
  @Input() visibleSort = false;
  @Input() sort;

  @Output() sortingChanged: EventEmitter<SortModel> = new EventEmitter();
  @Output() positionChanged: EventEmitter<{ pos: number; page: number }> = new EventEmitter();
  @Output() scrollChanged: EventEmitter<string> = new EventEmitter();

  @ViewChild(VirtualScrollerComponent) private virtualScroller: VirtualScrollerComponent;

  private unlocked = false;
  private readonly _searchingResultsChangesSubscription: Subscription;
  private readonly _scrollCommandChangesSubscription: Subscription;

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
    private _location: Location,
    private _activatedRoute: ActivatedRoute,
    private _searchResultsService: SearchResultsService,
  ) {
    this._scrollCommandChangesSubscription = this._searchResultsService.scrollCommandChanges$
      .subscribe((scrollCommand) => {
        if (scrollCommand === 'scroll') {
          const index = +this._activatedRoute.snapshot.queryParamMap.get('pos');
          if (index) {
            this._scrollToIndex(index, 200).then(() => setTimeout(() => {
                this.unlocked = true;
              }, 1200)
            );
          } else {
            this.unlocked = true;
            this.scrollChanged.emit(null);
          }
        }

        if (scrollCommand === 'stand') {
          this.unlocked = true;
          this.scrollChanged.emit(null);
        }
      });

    this._searchingResultsChangesSubscription = this._searchResultsService.searchingResultsChanges$
      .subscribe((isChange) => {
        if (isChange) {
          const currentUrl = this._location.path().split('?');

          this.queryParams = currentUrl[1] ? currentUrl[1].split('&').reduce((prev, curr) => {
            const param = curr.split('=');
            prev[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
            return prev;
          }, {}) : {};

          this.isRequestFulfilled = !!Object.keys(this.queryParams).length;
        }
      });
  }

  ngOnDestroy(): void {
    unsubscribeList([this._searchingResultsChangesSubscription, this._scrollCommandChangesSubscription]);
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
      this.scrollChanged.emit(null);
      return;
    }

    await this._sleep(10).then(() => this._scrollToIndex(index, --logout));
  }

  private _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
