import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BannerItemModel } from '../../models';

@Component({
  selector: 'market-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent {
  private _item: BannerItemModel;

  @Input() set item(val: BannerItemModel) {
    this._item = { ...{ btnText: 'Подробнее' }, ...val };
  }

  get item(): BannerItemModel {
    return this._item;
  }

  get isLinkExternal(): boolean {
    return !this.item?.btnLink.includes(location.hostname) && !(this.item?.btnLink[0] === '/');
  }

  constructor() {}
}
