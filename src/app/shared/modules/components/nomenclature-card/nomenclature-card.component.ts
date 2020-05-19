import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductOffersCardModel } from '#shared/modules/common-services/models';
import { absoluteImagePath } from '#shared/utils/get-image';


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
  @Input() product: ProductOffersCardModel;

  get imageUrl() {
    return absoluteImagePath(this.product.imageUrl || null);
  }

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
