import {Component, Inject, PLATFORM_ID} from '@angular/core';
import { BannerService } from '#shared/modules/common-services';
import {isPlatformBrowser} from '@angular/common';

@Component({
  templateUrl: './school-office.component.html',
  styleUrls: ['./school-office.component.scss'],
})
export class PromoSchoolOfficeComponent {

  supplierItems: any[];

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _bannerService: BannerService) {
    if(isPlatformBrowser(this._platformId)) {
      this._bannerService.getBanners()
        .subscribe((banners) => {
          this.supplierItems = banners._embedded.items;
        });
    }
  }
}
