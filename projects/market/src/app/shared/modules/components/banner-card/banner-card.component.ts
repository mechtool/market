import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-banner-card',
  templateUrl: './banner-card.component.html',
  styleUrls: [
    './banner-card.component.scss',
    './banner-card.component-576.scss',
    './banner-card.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerCardComponent {
  @Input() routerLink: string[];
  @Input() imageUrl : string;
  @Input() imgAlt : string;

  constructor() {}

}
