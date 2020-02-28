import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'c-main-popular',
  templateUrl: './popular.component.html',
  styleUrls: [
    './popular.component.scss',
    './popular.component-768.scss',
    './popular.component-576.scss',
  ],
})
export class MainPopularComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}
