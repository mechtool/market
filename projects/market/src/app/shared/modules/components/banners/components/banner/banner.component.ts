import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BannerItemModel } from '../../models';
import { NavigationService } from '#shared/modules/common-services/navigation.service';

@Component({
  selector: 'market-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss', './banner.component-400.scss'],
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
    return !this.item?.btnLink.includes(location.hostname) && this.item?.btnLink[0] !== '/';
  }

  constructor(private _navigationService: NavigationService) {}

  goTo(item: BannerItemModel, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this._navigationService.navigateReloadable([item.btnLink], { ...(item.btnQueryParams && { queryParams: item.btnQueryParams }) });
  }
}
