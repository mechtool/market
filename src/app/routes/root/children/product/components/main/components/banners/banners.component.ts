import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'my-main-banners',
  templateUrl: './banners.component.html',
  styleUrls: [
    './banners.component.scss',
    './banners.component-992.scss',
  ],
})
export class MainBannersComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
