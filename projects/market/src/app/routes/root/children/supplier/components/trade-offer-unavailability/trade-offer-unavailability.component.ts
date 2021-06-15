import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  templateUrl: './trade-offer-unavailability.component.html',
  styleUrls: ['./trade-offer-unavailability.component.scss'],
})
export class TradeOfferUnavailabilityComponent {
  @Input() locality: string;
  @Output() changeRegionEvent: EventEmitter<boolean> = new EventEmitter();

  changeRegion() {
    this.changeRegionEvent.emit(true);
  }
}


