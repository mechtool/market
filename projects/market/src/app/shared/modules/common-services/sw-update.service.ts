import {Inject, Injectable, OnDestroy, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {SwUpdate} from '@angular/service-worker';

@Injectable()
export class SwUpdateService implements OnDestroy {
  private caches;
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
      this.caches = this.doc?.defaultView?.caches;
      this.subs.push(this.swUpdate.available.subscribe(() => {
        this._deleteCaches().then(()=> {
            this.swUpdate.activateUpdate();
        })
      }));
      const t = setTimeout(() => {
        this.swUpdate.checkForUpdate();
        clearTimeout(t);
      }, 500)
    }
  }
  async _deleteCaches(){
    const cacheNames = await this.caches.keys();
    return new Promise((res)=> {
      cacheNames.forEach((cacheName) => {
        this.caches.delete(cacheName)
      })
      res(true);
    });
  }
}

