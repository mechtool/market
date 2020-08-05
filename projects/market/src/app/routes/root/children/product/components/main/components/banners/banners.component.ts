import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-main-banners',
  templateUrl: './banners.component.html',
  styleUrls: [
    './banners.component.scss',
    './banners.component-1580.scss',
    './banners.component-992.scss',
    './banners.component-768.scss',
    './banners.component-576.scss',
  ],
})
export class MainBannersComponent {
  array = [1, 2, 3, 4];

  constructor() {}

}

