import {Inject, Injectable, OnDestroy, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser} from '@angular/common';
import {SwUpdate} from '@angular/service-worker';

@Injectable()
export class SwUpdateService implements OnDestroy{
  public subs = [];
  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    public swUpdate : SwUpdate) {

    if (isPlatformBrowser(this._platformId) && this.swUpdate.isEnabled){
      this.subs.push(this.swUpdate.available.subscribe( () => {
        this.swUpdate.activateUpdate();
      }));
      const t = setTimeout(() => {
        this.swUpdate.checkForUpdate();
        clearTimeout(t);
      }, 500)
    }
  }

  ngOnDestroy() {
    this.subs.forEach( (s) => s.unsubscribe());
  }

}
