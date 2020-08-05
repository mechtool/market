import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SortModel, TradeOfferDto } from '#shared/modules';

@Component({
  selector: 'market-trade-offer-cards-list',
  templateUrl: './trade-offer-cards-list.component.html',
  styleUrls: [
    './trade-offer-cards-list.component.scss',
    './trade-offer-cards-list.component-1300.scss',
    './trade-offer-cards-list.component-992.scss',
    './trade-offer-cards-list.component-768.scss',
    './trade-offer-cards-list.component-576.scss',
  ],
})
export class TradeOfferCardsListComponent implements OnChanges {

  sortTypes = [
    { type: SortModel.ASC, label: 'По возрастанию цены' },
    { type: SortModel.DESC, label: 'По убыванию цены' }
  ];

  @Input() sort: SortModel;
  @Input() tradeOffers: TradeOfferDto[];
  @Output() sortChange: EventEmitter<SortModel> = new EventEmitter();

  constructor() {
  }

  get currentSortType(): any {
    if (this.sort) {
      return this.sortTypes.find(type => type.type === this.sort);
    }
    return this.sortTypes[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tradeOffers && this.sort) {
      this._compare(this.sort);
    }
  }

  chooseSort(item: any) {
    this._compare(item.type);
    this.sortChange.emit(item.type);
  }

  private _compare(sort: SortModel) {
    this.tradeOffers.sort((first, second) => {
      const one = this._assignValue(first.price, sort);
      const two = this._assignValue(second.price, sort);
      return sort === SortModel.ASC ? one - two : two - one;
    });
  }

  private _assignValue(value: number, sort: SortModel): number {
    if (!value && sort === SortModel.DESC) {
      return Number.MIN_SAFE_INTEGER;
    }

    if (!value && sort === SortModel.ASC) {
      return Number.MAX_SAFE_INTEGER;
    }

    return value;
  }
}
