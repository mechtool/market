import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TradeOfferResponseModel } from '#shared/modules/common-services/models';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-terms-of-sale',
  templateUrl: './terms-of-sale.component.html',
  styleUrls: [
    './terms-of-sale.component.scss',
    './terms-of-sale.component-576.scss',
    './terms-of-sale.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsOfSaleComponent {

  @Input() tradeOffer: TradeOfferResponseModel;

  get packaging(): string | number {
    const units = this.tradeOffer.termsOfSale.packaging.unitsNumerator / this.tradeOffer.termsOfSale.packaging.unitsDenominator;
    if (this.tradeOffer.termsOfSale.packaging.description) {
      return `${units} ${this.tradeOffer.termsOfSale.packaging.description.toLowerCase()}`;
    }
    return `${units} шт.`;
  }

  get packageMultiplicity(): string | number {
    const packageMultiplicity = this.tradeOffer.termsOfSale.packageMultiplicity;
    if (this.tradeOffer.termsOfSale.packaging.description) {
      return `${packageMultiplicity} ${this.tradeOffer.termsOfSale.packaging.description.toLowerCase()}`;
    }
    return `${packageMultiplicity} шт.`;
  }

  get minQuantity(): string {
    if (this.tradeOffer.termsOfSale.price?.matrix?.length) {
      const fromPackages = [...this.tradeOffer.termsOfSale.price.matrix]
        .sort((one, two) => one.fromPackages - two.fromPackages)[0].fromPackages;

      if (fromPackages > 1) {
        if (this.tradeOffer.termsOfSale.packaging.description) {
          return `от ${fromPackages} ${this.tradeOffer.termsOfSale.packaging.description.toLowerCase()}`;
        }
        return `от ${fromPackages} шт.`;
      }
    }
    return null;
  }

}
