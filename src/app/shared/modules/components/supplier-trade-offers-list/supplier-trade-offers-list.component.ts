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
  TradeOfferVatEnumModel
} from '#shared/modules';
import { ActivatedRoute, Router } from '@angular/router';
import { absoluteImagePath, containParametersForRequest, mapStock, queryParamsFrom } from '#shared/utils';

@Component({
  selector: 'my-supplier-trade-offers-list',
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
  @Input() sort: SortModel;
  @Output() loadTradeOffers: EventEmitter<number> = new EventEmitter();

  availableFilters: DefaultSearchAvailableModel;
  visibleSort: boolean;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _localStorageService: LocalStorageService,
  ) {
    this._activatedRoute.queryParams.subscribe((queryParams) => {
      this.visibleSort = containParametersForRequest(queryParams);
    });
  }

  queryParametersChange(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    this.availableFilters = filters.availableFilters;
    this.sort = filters.sort;
    this._router.navigate([`/supplier/${this.supplier.id}`], {
      queryParams: queryParamsFrom(filters),
    });
  }

  imageUrl(images: string[]) {
    return images ? absoluteImagePath(images[0]) : absoluteImagePath(null);
  }

  price(price: number) {
    return Number.isInteger(price) ? price / 100 : '';
  }

  vat(price: TradeOfferSummaryPriceModel) {
    if (price && price.includesVAT) {
      switch (price.vat) {
        case TradeOfferVatEnumModel.VAT_10:
          return 'НДС 10%';
        case TradeOfferVatEnumModel.VAT_20:
          return 'НДС 20%';
        case TradeOfferVatEnumModel.VAT_WITHOUT:
          return 'Без НДС';
      }
    }
    return 'Без НДС';
  }

  stock(level: TradeOfferStockEnumModel) {
    return mapStock(level);
  }

  route(tradeOfferId: string) {
    this._router.navigate([`./supplier/${this.supplier.id}/offer/${tradeOfferId}`]);
  }

  tradeOffersLoading(nextPage: number) {
    this.loadTradeOffers.emit(nextPage);
  }
}