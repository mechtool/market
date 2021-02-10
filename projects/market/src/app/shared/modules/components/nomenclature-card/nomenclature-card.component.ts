import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProductOffersModel } from '#shared/modules/common-services/models';
import { absoluteImagePath } from '#shared/utils/get-image';


@Component({
  selector: 'market-nomenclature-card',
  templateUrl: './nomenclature-card.component.html',
  styleUrls: [
    './nomenclature-card.component.scss',
    './nomenclature-card.component-576.scss',
    './nomenclature-card.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NomenclatureCardComponent implements AfterViewInit {
  @Input() productOffer: ProductOffersModel;

  ngAfterViewInit() {
    dispatchEvent(new CustomEvent('scroll'));
  }

  get imageUrl() {
    return this.productOffer.product?.images?.length ? absoluteImagePath(this.productOffer.product.images[0].href) : null;
  }
}
