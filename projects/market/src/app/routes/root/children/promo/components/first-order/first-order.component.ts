import {Component, Inject, PLATFORM_ID} from '@angular/core';
import { BannerService } from '#shared/modules/common-services';
import {isPlatformBrowser} from '@angular/common';

@Component({
  templateUrl: './first-order.component.html',
  styleUrls: ['./first-order.component.scss'],
})
export class PromoFirstOrderComponent {

  supplierItems: any[];

  constructor(private _bannerService: BannerService,
              @Inject(PLATFORM_ID) private _platformId: Object,) {
    if(isPlatformBrowser(this._platformId)) {
      this._bannerService.getBanners()
        .subscribe((banners) => {
          this.supplierItems = banners._embedded.items;
        });
    }
  }
}
