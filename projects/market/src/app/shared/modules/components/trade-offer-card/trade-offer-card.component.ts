import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeOfferDto } from '#shared/modules';
import { Router } from '@angular/router';
import { stringToRGB } from '#shared/utils';

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
export class TradeOfferCardComponent {

  @Input() tradeOffer: TradeOfferDto;

  get argb() {
    return stringToRGB(this.tradeOffer?.supplierId);
  }

  constructor(private _router: Router) {
  }

  clickTradeOffer() {
    this._router.navigate([`/supplier/${this.tradeOffer.supplierId}/offer/${this.tradeOffer.id}`]);
  }
}
