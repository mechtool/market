import { Inject, Injectable, Renderer2, RendererFactory2, PLATFORM_ID } from '@angular/core';
import { Location, isPlatformBrowser } from '@angular/common';
import { MetrikaEventTypeModel, MetrikaEventOptionsModel } from './models';
import { delayedRetry } from '#shared/utils';
import { from, Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserStateService } from './user-state.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { environment } from '#environments/environment';

declare global {
  interface Window {
    ym: any;
  }
}

@Injectable()
export class ExternalProvidersService {
  private _metrikaID = environment['metrikaID'] || null;
  private _renderer: Renderer2;
  private _yandexTranslatePopupEl: HTMLElement = null;
  private _yandexMetrikaPrevPath = this._location.path();
  private readonly _ym: any = null;
  private readonly _isMetrikaAvailable: boolean = null;

  constructor(
    private _rendererFactory: RendererFactory2,
    private _location: Location,
    private _gtmService: GoogleTagManagerService,
    private _userStateService: UserStateService,
    @Inject(PLATFORM_ID) private _platformId: Object,
  ) {
    this._renderer = _rendererFactory.createRenderer(null, null);
    this._ym = isPlatformBrowser(this._platformId) ? window.ym || null : null;
    this._isMetrikaAvailable = this._ym && this._metrikaID;
  }

  resetYandexTranslatePopupPosition(): void {
    this._yandexTranslatePopupEl = document.getElementById('tr-popup');
    if (this._yandexTranslatePopupEl) {
      this._renderer.setStyle(this._yandexTranslatePopupEl, 'top', 'auto');
      this._renderer.setStyle(this._yandexTranslatePopupEl, 'right', 'auto');
      this._renderer.setStyle(this._yandexTranslatePopupEl, 'bottom', '0');
      this._renderer.setStyle(this._yandexTranslatePopupEl, 'left', '0');
    }
  }

  fireGTMEvent(tag: any): void {
    if (this._isMetrikaAvailable) {
      this._gtmService.pushTag(tag);
    }
  }

  hitYandexMetrika(): void {
    if (this._isMetrikaAvailable) {
      const newPath = this._location.path();
      this._ym(this._metrikaID, 'hit', newPath, {
        referer: this._yandexMetrikaPrevPath,
      });
      this._yandexMetrikaPrevPath = newPath;
    }
  }

  fireYandexMetrikaEvent(eventType: MetrikaEventTypeModel, options?: MetrikaEventOptionsModel): void {
    if (this._isMetrikaAvailable) {
      const login = this._userStateService.userData$.getValue()?.userInfo.login;
      let opts = options;
      if (opts?.params && login) {
        opts.params['логин'] = login;
      }
      if (!opts?.params && login) {
        opts = {
          params: {
            логин: login,
          },
        };
      }
      if (!opts) {
        this._ym(this._metrikaID, 'reachGoal', eventType);
      }
      if (opts) {
        this._ym(this._metrikaID, 'reachGoal', eventType, opts);
      }
    }
  }
}
