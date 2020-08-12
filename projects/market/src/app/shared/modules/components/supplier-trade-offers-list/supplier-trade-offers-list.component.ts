import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AllGroupQueryFiltersModel,
  DefaultSearchAvailableModel,
  LocalStorageService,
  SortModel,
  SuppliersItemModel,
  TradeOfferStockEnumModel,
  TradeOfferSummaryModel,
  TradeOfferSummaryPriceModel,
  TradeOfferVatEnumModel,
} from '#shared/modules';
import { Router } from '@angular/router';
import { absoluteImagePath, mapStock, queryParamsWithoutSupplierIdFrom } from '#shared/utils';

@Component({
  selector: 'market-supplier-trade-offers-list',
  templateUrl: './supplier-trade-offers-list.component.html',
  styleUrls: [
    './supplier-trade-offers-list.component.scss',
    './supplier-trade-offers-list.component-1380.scss',
    './supplier-trade-offers-list.component-1300.scss',
    './supplier-trade-offers-list.component-1100.scss',
    './supplier-trade-offers-list.component-992.scss',
    './supplier-trade-offers-list.component-768.scss',
    './supplier-trade-offers-list.component-576.scss',
    './supplier-trade-offers-list.component-360.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SupplierTradeOffersListComponent {

  @Input() supplier: SuppliersItemModel;
  @Input() tradeOffers: TradeOfferSummaryModel[];
  @Input() tradeOffersTotal: number;
  @Input() isLoading: boolean;
  @Input() page: number;
  @Input() query: string;
  @Input() availableFilters: DefaultSearchAvailableModel;
  @Input() sort: SortModel;
  @Output() loadTradeOffers: EventEmitter<number> = new EventEmitter();

  get found() {
    return this.tradeOffersTotal < 10000 ? 'найдено' : 'найдено более';
  }

  constructor(
    private _router: Router,
    private _localStorageService: LocalStorageService,
  ) {
  }

  queryParametersChange(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    this.availableFilters = filters.availableFilters;
    this.sort = filters.sort;
    const params = queryParamsWithoutSupplierIdFrom(filters);
    this._router.navigate([`/supplier/${this.supplier.id}`], {
      queryParams: params,
    });
  }

  imageUrl(images: string[]) {
    return images?.length ? absoluteImagePath(images[0]) : null;
  }

  vat(price: TradeOfferSummaryPriceModel) {
    const includesVAT = price?.includesVAT;
    switch (price?.vat) {
      case TradeOfferVatEnumModel.VAT_10:
        return includesVAT ? 'с НДС 10%' : 'без НДС 10%';
      case TradeOfferVatEnumModel.VAT_20:
        return includesVAT ? 'с НДС 20%' : 'без НДС 20%';
      case TradeOfferVatEnumModel.VAT_WITHOUT:
        return 'без НДС';
      default:
        return null;
    }
  }

  stock(level: TradeOfferStockEnumModel, temporarilyOutOfSales: boolean) {
    if (temporarilyOutOfSales) {
      return 'снят с продажи';
    }
    return mapStock(level);
  }

  route(tradeOfferId: string) {
    this._router.navigate([`./supplier/${this.supplier.id}/offer/${tradeOfferId}`]);
  }

  tradeOffersLoading(nextPage: number) {
    this.loadTradeOffers.emit(nextPage);
  }
}
