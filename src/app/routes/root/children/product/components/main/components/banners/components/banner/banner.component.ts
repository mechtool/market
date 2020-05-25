import { Component, OnInit, OnDestroy, Input, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'my-main-banners-banner',
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
export class MainBannersBannerComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() title: string;
  @Input() btnLink: string;
  @Input() btnText: string;

  constructor() {}

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
