import { Component, Input } from '@angular/core';
import { Router } from "@angular/router";
import { LocalStorageService } from "#shared/modules";

@Component({
  templateUrl: './trade-offer-unavailability.component.html',
  styleUrls: ['./trade-offer-unavailability.component.scss'],
})
export class TradeOfferUnavailabilityComponent {
  @Input() fias:  string;
  @Input() locality: string;

  constructor(
    private _router: Router,
    private _localStorageService: LocalStorageService,) {}

  changeRegion() {
    this._localStorageService.resetRegion()
    location.reload(false);
  }

}


