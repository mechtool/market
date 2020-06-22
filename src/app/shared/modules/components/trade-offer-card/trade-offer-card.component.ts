import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TradeOfferInfoModel } from '#shared/modules';
import { randomARGB } from '#shared/utils/get-color';
import { Router } from '@angular/router';

@Component({
  selector: 'my-trade-offer-info-card',
  templateUrl: './trade-offer-card.component.html',
  styleUrls: [
    './trade-offer-card.component.scss',
    './trade-offer-card.component-576.scss',
    './trade-offer-card.component-400.scss',
    './trade-offer-card.component-340.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradeOfferCardComponent implements OnInit, OnDestroy {

  @Input() tradeOffer: TradeOfferInfoModel;

  get argb() {
    return randomARGB();
  }

  constructor(private _router: Router) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  clickTradeOffer() {
    this._router.navigate([`/supplier/${this.tradeOffer.supplierId}/offer/${this.tradeOffer.id}`]);
  }
}
