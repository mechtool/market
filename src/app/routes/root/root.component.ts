import {
  Component,
  OnDestroy,
  OnInit,
 } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationService, ResponsiveService } from '#shared/modules';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  templateUrl: './root.component.html',
  styleUrls: [
    './root.component.scss',
    './root.component-992.scss',
    './root.component-768.scss',
  ],
})
export class RootComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();

  get isMenuExpanded$() {
    return this._navService.isMenuExpanded$.asObservable()
      .pipe(
        takeUntil(this._unsubscriber$),
        filter(res => !!res),
      );
  }

  constructor(
    private _navService: NavigationService,
    private _responsiveService: ResponsiveService,
  ) {
    this._responsiveService.init();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

}

