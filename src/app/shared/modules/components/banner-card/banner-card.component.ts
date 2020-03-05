import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'c-banner-card',
  templateUrl: './banner-card.component.html',
  styleUrls: [
    './banner-card.component.scss',
    './banner-card.component-576.scss',
    './banner-card.component-400.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerCardComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  @Input() routerLink: string[];
  @Input() imageUrl : string;
  @Input() imgAlt : string;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
