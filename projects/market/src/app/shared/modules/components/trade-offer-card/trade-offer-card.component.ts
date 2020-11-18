import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TradeOfferDto } from '#shared/modules';

@Component({
  selector: 'market-trade-offer-info-card',
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

}
