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
    const product = this.tradeOffer.product.ref1cNomenclature || this.tradeOffer.product.supplierNomenclature;
    return `${units} ${product.baseUnitOkei?.nsymb}.`;
  }

  get packageMultiplicity(): string | number {
    const packageMultiplicity = this.tradeOffer.termsOfSale.packageMultiplicity;
    const product = this.tradeOffer.product.ref1cNomenclature || this.tradeOffer.product.supplierNomenclature;
    return `${packageMultiplicity} ${product.baseUnitOkei?.nsymb}.`;
  }

  get minQuantity(): string {
    if (this.tradeOffer.termsOfSale.price?.matrix?.length) {
      const fromPackages = [...this.tradeOffer.termsOfSale.price.matrix]
        .sort((one, two) => one.fromPackages - two.fromPackages)[0].fromPackages;

      if (fromPackages > 1) {
        const product = this.tradeOffer.product.ref1cNomenclature || this.tradeOffer.product.supplierNomenclature;
        return `от ${fromPackages} ${product.baseUnitOkei?.nsymb}.`;
      }
    }
    return null;
  }

}
