import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductOffersModel } from '#shared/modules/common-services/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'my-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: [
    './search-results.component.scss',
    './search-results.component-768.scss',
    './search-results.component-576.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent implements OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() productOffers: ProductOffersModel[];
  @Input() productsTotal: number;
  @Input() page: number;
  @Input() isLoading: boolean;
  @Output() loadProducts: EventEmitter<number> = new EventEmitter();

  isRequestFulfilled: boolean;

  constructor(private _activatedRoute: ActivatedRoute) {
    this._activatedRoute.queryParams.subscribe((queryParams) => {
      if (Object.keys(queryParams).length === 1 && queryParams.sort) {
        this.isRequestFulfilled = false;
      } else {
        this.isRequestFulfilled = !!Object.keys(queryParams).length;
      }
    });

  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  productOffersLoading(nextPage: number) {
    this.loadProducts.emit(nextPage);
  }
}
