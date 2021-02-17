import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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
export class TradeOfferCardComponent implements OnInit {

  @Input() tradeOffer: TradeOfferDto;
  deliveryRegionsShortList: string;
  pickupFromShortList: string;

  ngOnInit(): void {
    this.deliveryRegionsShortList = this.tradeOffer.deliveryRegions ? this.crop(this.tradeOffer.deliveryRegions) : null;
    this.pickupFromShortList = this.tradeOffer.pickupFrom ? this.crop(this.tradeOffer.pickupFrom): null;
  }

  crop(values: string[]): string {
    const value = values.join(' ; ');
    return value.length > 100 ? `${value.substr(0, 100)}...` : value;
  }
}
