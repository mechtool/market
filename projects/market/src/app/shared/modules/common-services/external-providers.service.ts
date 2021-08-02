import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { MetrikaEventOptionsModel, MetrikaEventTypeModel } from './models';
import { UserStateService } from './user-state.service';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { environment } from '#environments/environment';
import { waitFor } from '#shared/utils';

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
  private _isProduction = environment['production'] || false;

  get ym(): any {
    return isPlatformBrowser(this._platformId) ? window.ym || null : null;
  }

  constructor(
    private _rendererFactory: RendererFactory2,
    private _location: Location,
    private _gtmService: GoogleTagManagerService,
    private _userStateService: UserStateService,
    @Inject(PLATFORM_ID) private _platformId: Object,
  ) {
    this._renderer = _rendererFactory.createRenderer(null, null);
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
    if (this._isProduction && isPlatformBrowser(this._platformId)) {
      this._gtmService.pushTag(tag).catch((err) => true);
    }
  }

  hitYandexMetrika(): void {
    if (this._isProduction) {
      waitFor(() => this.ym, () => {
        const newPath = this._location.path();
        this.ym?.(this._metrikaID, 'hit', newPath, {
          referer: this._yandexMetrikaPrevPath,
        });
        this._yandexMetrikaPrevPath = newPath;
      });
    }
  }

  fireYandexMetrikaEvent(eventType: MetrikaEventTypeModel, options?: MetrikaEventOptionsModel): void {
    if (this._isProduction) {
      waitFor(() => this.ym, () => {
        const login = this._userStateService.currentUser$.getValue()?.userInfo.login;
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
          this.ym?.(this._metrikaID, 'reachGoal', eventType);
        }
        if (opts) {
          this.ym?.(this._metrikaID, 'reachGoal', eventType, opts);
        }
      })
    }
  }
}
