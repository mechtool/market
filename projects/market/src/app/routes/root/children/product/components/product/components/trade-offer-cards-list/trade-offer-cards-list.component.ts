import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalStorageService, Megacity, SortModel, TradeOfferDto } from '#shared/modules';

@Component({
  selector: 'market-trade-offer-cards-list',
  templateUrl: './trade-offer-cards-list.component.html',
  styleUrls: [
    './trade-offer-cards-list.component.scss',
    './trade-offer-cards-list.component-1300.scss',
    './trade-offer-cards-list.component-992.scss',
    './trade-offer-cards-list.component-768.scss',
  ],
})
export class TradeOfferCardsListComponent implements OnInit {

  userRegion: string;

  @Input() sort: SortModel;
  @Input() tradeOffers: TradeOfferDto[];
  @Input() offersFoundInUserRegion: boolean;
  @Output() sortChange: EventEmitter<SortModel> = new EventEmitter();

  constructor(private _localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    if (!this._localStorageService.hasUserLocation()) {
      this._localStorageService.putUserLocation(Megacity.RUSSIA);
    }
    this.userRegion = this._localStorageService.getUserLocation().name;
  }

  chooseSort(sort: any) {
    this._compare(sort);
    this.sortChange.emit(sort);
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
