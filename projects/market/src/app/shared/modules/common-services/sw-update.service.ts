import {Inject, Injectable, OnDestroy, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {SwUpdate} from '@angular/service-worker';

@Injectable()
export class SwUpdateService implements OnDestroy {
  private win;
  private subs = [];

  constructor(
    @Inject(DOCUMENT) private doc : Document,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private swUpdate: SwUpdate) {}

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  setUp() {
    if (isPlatformBrowser(this._platformId) && this.swUpdate.isEnabled) {
      const t = setTimeout(()=>{
        const channel = new BroadcastChannel('sw-messages');
        channel.postMessage({type : 'checkUpdate'});
        clearTimeout(t);
      }, 500);

    }
  }
}

