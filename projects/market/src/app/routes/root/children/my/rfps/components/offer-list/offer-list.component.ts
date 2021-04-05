import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OfferListItemModel } from '../../models';

@Component({
  selector: 'market-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: [
    './offer-list.component.scss',
    './offer-list.component-768.scss',
  ]
})
export class OfferListComponent {
  @Input() offers: OfferListItemModel[] = null;
  @Output() viewOfferChange: EventEmitter<number> = new EventEmitter();
  @Output() viewRfpByOfferIdChange: EventEmitter<number> = new EventEmitter();

  viewOffer(offerId: number): void {
    this.viewOfferChange.emit(offerId);
  }

  viewRfpByOfferId(offerId: number): void {
    this.viewRfpByOfferIdChange.emit(offerId);
  }

}
