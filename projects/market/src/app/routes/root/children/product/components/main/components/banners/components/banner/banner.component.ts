import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-main-banners-banner',
  templateUrl: './banner.component.html',
  styleUrls: [
    './banner.component.scss',
    './banner.component-1680.scss',
    './banner.component-1580.scss',
    './banner.component-992.scss',
    './banner.component-768.scss',
    './banner.component-576.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainBannersBannerComponent {
  @Input() title: string;
  @Input() btnLink: string;
  @Input() btnText: string;

  constructor() {}

}
