import {Inject, Injectable, OnDestroy, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser} from '@angular/common';
import {SwUpdate} from '@angular/service-worker';

@Injectable()
export class SwUpdateService implements OnDestroy {
  private subs = [];

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private swUpdate: SwUpdate) {
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  setUp() {
    if (isPlatformBrowser(this._platformId) && this.swUpdate.isEnabled) {
      this.subs.push(this.swUpdate.available.subscribe(() => {
        this.swUpdate.activateUpdate();
      }));
      const t = setTimeout(() => {
        this.swUpdate.checkForUpdate();
        clearTimeout(t);
      }, 500)
    }
  }
}
