import { Component } from '@angular/core';
import { BannerService } from '#shared/modules/common-services';

@Component({
  templateUrl: './school-office.component.html',
  styleUrls: ['./school-office.component.scss'],
})
export class PromoSchoolOfficeComponent {

  supplierItems: any[];

  constructor(private _bannerService: BannerService) {
    this._bannerService.getBanners()
      .subscribe((banners) => {
        this.supplierItems = banners._embedded.items;
      });
  }
}
