import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TradeOfferResponseModel } from '#shared/modules';
import { mapStock } from '#shared/utils';

@Component({
  selector: 'my-terms-of-sale',
  templateUrl: './terms-of-sale.component.html',
  styleUrls: [
    './terms-of-sale.component.scss',
    './terms-of-sale.component-576.scss',
    './terms-of-sale.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsOfSaleComponent implements OnInit, OnDestroy {

  @Input() tradeOffer: TradeOfferResponseModel;

  get stockLevel(): string {
    return mapStock(this.tradeOffer.stock?.stockBalanceSummary?.level);
  }

  get packaging(): string | number {
    const units = this.tradeOffer.termsOfSale.packaging.unitsNumerator / this.tradeOffer.termsOfSale.packaging.unitsDenominator;
    if (this.tradeOffer.termsOfSale.packaging.description) {
      return `${units} ${this.tradeOffer.termsOfSale.packaging.description.toLowerCase()}`;
    }
    return units;
  }

  get offerDescription() {
    if (this.tradeOffer.offerDescription?.title && this.tradeOffer.offerDescription?.description) {
      return `${this.tradeOffer.offerDescription.title} ${this.tradeOffer.offerDescription.description}`;
    }
    if (this.tradeOffer.offerDescription?.title) {
      return this.tradeOffer.offerDescription.title;
    }
    if (this.tradeOffer.offerDescription?.description) {
      return this.tradeOffer.offerDescription?.description;
    }
    return null;
  }

  get orderRestrictions(): number {
    if (this.tradeOffer.termsOfSale.orderRestrictions?.sum) {
      return this.tradeOffer.termsOfSale.orderRestrictions.sum.minimum;
    }
    return null;
  }

  get maxDaysForShipment(): number {
    return this.tradeOffer.termsOfSale.maxDaysForShipment;
  }

  get deliveryMethod(): string {
    if (this.tradeOffer.deliveryDescription?.deliveryRegions && this.tradeOffer.deliveryDescription?.pickupFrom) {
      return 'доставка и самовывоз';
    }
    if (this.tradeOffer.deliveryDescription?.deliveryRegions) {
      return 'доставка';
    }
    if (this.tradeOffer.deliveryDescription?.pickupFrom) {
      return 'самовывоз';
    }
    return null;
  }

  get delivery(): string {
    if (this.tradeOffer.deliveryDescription?.deliveryRegions) {
      let deliveryRegions = '';
      this.tradeOffer.deliveryDescription.deliveryRegions
        .forEach((tradeOfferDelivery, index, array) => {
          if (index + 1 < array.length) {
            deliveryRegions += `${tradeOfferDelivery.name}, `;
          } else {
            deliveryRegions += tradeOfferDelivery.name;
          }
        });
      return deliveryRegions;
    }
    return null;
  }

  constructor() {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }
}
