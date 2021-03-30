import { Component } from '@angular/core';
import { BannerService } from '#shared/modules/common-services';

@Component({
  templateUrl: './first-order.component.html',
  styleUrls: ['./first-order.component.scss'],
})
export class PromoFirstOrderComponent {

  supplierItems: any[];

  constructor(private _bannerService: BannerService) {
    this._bannerService.getBanners()
      .subscribe((banners) => {
        this.supplierItems = banners._embedded.items;
      });
  }
}
