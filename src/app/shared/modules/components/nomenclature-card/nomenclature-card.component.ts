import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductOffersModel } from '#shared/modules/common-services/models';
import { absoluteImagePath } from '#shared/utils/get-image';
import { NavigationService } from '#shared/modules/common-services/navigation.service';


@Component({
  selector: 'my-nomenclature-card',
  templateUrl: './nomenclature-card.component.html',
  styleUrls: [
    './nomenclature-card.component.scss',
    './nomenclature-card.component-576.scss',
    './nomenclature-card.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NomenclatureCardComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() productOffer: ProductOffersModel;

  get imageUrl() {
    const img = this.productOffer.product?.images?.length ? this.productOffer.product.images[0].href : null;
    return absoluteImagePath(img);
  }

  constructor(private _navService: NavigationService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  goToProduct() {
    this._navService.goTo([`/product/${this.productOffer?.product.id}`]);
  }


}
