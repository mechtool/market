import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductOffersModel } from '#shared/modules/common-services/models';
import { ActivatedRoute } from '@angular/router';
import { containParametersForRequest } from '#shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'my-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: [
    './search-results.component.scss',
    './search-results.component-992.scss',
    './search-results.component-768.scss',
    './search-results.component-576.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent {
  @Input() productOffers: ProductOffersModel[];
  @Input() productsTotal: number;
  @Input() page: number;
  @Input() isLoading: boolean;
  @Output() loadProducts: EventEmitter<number> = new EventEmitter();

  isRequestFulfilled: boolean;

  constructor(private _activatedRoute: ActivatedRoute) {
    this._activatedRoute.queryParams.subscribe((queryParams) => {
      this.isRequestFulfilled = containParametersForRequest(queryParams);
    });

  }

  productOffersLoading(nextPage: number) {
    this.loadProducts.emit(nextPage);
  }
}
