import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CategoryModel, ProductOffersModel, SortModel } from '#shared/modules/common-services/models';
import { ActivatedRoute } from '@angular/router';
import { containParameters } from '#shared/utils';
import { MAX_VALUE } from '#shared/modules/pipes/found.pipe';
import { BehaviorSubject, combineLatest, Observable, of, Subscription } from 'rxjs';
import { CategoryService, NavigationService, SpinnerService } from '#shared/modules/common-services';
import { IPageInfo, VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { debounceTime, distinctUntilChanged, filter, pairwise, tap } from 'rxjs/operators';

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
export class SearchResultComponent implements OnInit {
  @Input() category: CategoryModel;
  @Input() productOffers: ProductOffersModel[];
  @Input() productsTotal: number;
  @Input() page: number;
  private _scrollPosition: number;
  @Input() set scrollPosition(val: number) {
    this._scrollPosition = val;
    if (this._scrollPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: this._scrollPosition,
          left: 0,
          behavior: 'smooth',
        });
      }, 300);
    }
  }

  get scrollPosition(): number {
    return this._scrollPosition;
  }

  @Input() visibleSort = false;
  @Input() sort;
  @Output() pageChanged: EventEmitter<{ fetchable: boolean; newPage: any }> = new EventEmitter();
  @Output() sortingChanged: EventEmitter<SortModel> = new EventEmitter();
  @ViewChild(VirtualScrollerComponent)
  private virtualScroller: VirtualScrollerComponent;
  scrollChange$: BehaviorSubject<any> = new BehaviorSubject(null);
  scrollChangeSubscription: Subscription;
  @Input() chunkSize = 30;

  isRequestFulfilled: boolean;
  queryParams: any;

  isPageUsed = false;

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

  ngOnInit() {
    this.scrollChangeSubscription = this.scrollChange$
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        filter((res) => {
          return !this._navigationService.isMenuOpened;
        }),
        pairwise(),
        filter((res) => {
          return !this.productOffers || this.productOffers.length >= this.chunkSize;
        }),
      )
      .subscribe(
        ([prevEvent, currEvent]) => {
          if (!this.isPageUsed) {
            this.isPageUsed = true;
            if (this.scrollPosition) {
              window.scrollTo({
                top: this.scrollPosition,
                left: 0,
                behavior: 'smooth',
              });
            }
            if (!this.scrollPosition && this.page) {
              const scrollToIndex = this.page * this.chunkSize;
              this.virtualScroller.scrollToIndex(scrollToIndex);
            }
            return;
          }
          const fetchable = currEvent.endIndex + 1 === this.productOffers.length && (currEvent.endIndex + 1) % this.chunkSize === 0;
          const params = {
            fetchable,
            newPage: Math.floor((currEvent.endIndex + 1) / this.chunkSize),
          };
          this.pageChanged.emit(params);
        },
        () => {},
      );
  }

  sortChange(sort: SortModel) {
    this.sortingChanged.emit(sort);
  }

  fetchMore(event: IPageInfo) {
    this.scrollChange$.next(event);
  }
}
