import { AfterViewChecked, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AllGroupQueryFiltersModel,
  DefaultSearchAvailableModel,
  LocalStorageService,
  SortModel,
  SuppliersItemModel,
  TradeOfferPriceMatrixModel,
  TradeOfferSummaryModel,
  TradeOfferSummaryPriceModel,
  TradeOfferVatEnumModel,
} from '#shared/modules';
import { Router } from '@angular/router';
import { absoluteImagePath, hasRequiredParameters, queryParamsWithoutSupplierIdFrom } from '#shared/utils';
import { MAX_VALUE } from '#shared/modules/pipes/found.pipe';

@Component({
  selector: 'market-supplier-trade-offers-list',
  templateUrl: './supplier-trade-offers-list.component.html',
  styleUrls: [
    './supplier-trade-offers-list.component.scss',
    './supplier-trade-offers-list.component-1100.scss',
    './supplier-trade-offers-list.component-992.scss',
    './supplier-trade-offers-list.component-768.scss',
    './supplier-trade-offers-list.component-576.scss',
    './supplier-trade-offers-list.component-360.scss',
  ],
})
export class SupplierTradeOffersListComponent implements AfterViewChecked {
  @Input() supplier: SuppliersItemModel;
  @Input() tradeOffers: TradeOfferSummaryModel[];
  @Input() tradeOffersTotal: number;
  @Input() page: number;
  @Input() query: string;
  @Input() filters: DefaultSearchAvailableModel;
  @Input() sort: SortModel;
  @Output() loadTradeOffers: EventEmitter<number> = new EventEmitter();
  @Output() cityChange: EventEmitter<boolean> = new EventEmitter();

  get foundCount() {
    return this.tradeOffersTotal < MAX_VALUE ? this.tradeOffersTotal : MAX_VALUE;
  }

  constructor(private _router: Router,
              private _localStorageService: LocalStorageService) {
  }

  ngAfterViewChecked() {
    dispatchEvent(new CustomEvent('scroll'));
  }

  changeQueryParamsAndRefresh(groupQuery: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(groupQuery.query);
    this.addOrRemoveSorting(groupQuery);
    const params = queryParamsWithoutSupplierIdFrom(groupQuery);
    this._router.navigate([`/supplier/${this.supplier.id}`], {
      queryParams: params,
    });
  }

  sortChange(sort: SortModel) {
    this.sort = sort;
    this.changeQueryParamsAndRefresh({
      query: this.query,
      filters: this.filters,
      sort: this.sort,
    });
  }

  imageUrl(images: string[]) {
    return images?.length ? absoluteImagePath(images[0]) : null;
  }

  vat(price: TradeOfferSummaryPriceModel) {
    const includesVAT = price?.includesVAT;
    switch (price?.vat) {
      case TradeOfferVatEnumModel.VAT_10:
        return includesVAT ? '?? ?????? 10%' : '?????? ?????? 10%';
      case TradeOfferVatEnumModel.VAT_20:
        return includesVAT ? '?? ?????? 20%' : '?????? ?????? 20%';
      case TradeOfferVatEnumModel.VAT_WITHOUT:
        return '?????? ??????';
      default:
        return null;
    }
  }

  fromPackages(matrix: TradeOfferPriceMatrixModel[]) {
    if (matrix?.length) {
      const fromPackages = [...matrix]
        .sort((one, two) => one.fromPackages - two.fromPackages)[0].fromPackages;
      return `???? ${fromPackages} ????.`;
    }
    return null;
  }

  tradeOffersLoading(nextPage: number) {
    this.loadTradeOffers.emit(nextPage);
  }

  private addOrRemoveSorting(groupQuery: AllGroupQueryFiltersModel) {
    if (hasRequiredParameters(groupQuery)) {
      groupQuery.sort = this.sort;
    }
  }
}
