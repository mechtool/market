import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Location } from '@angular/common';
import { Metrika } from 'ng-yandex-metrika';
import { MetrikaEventTypeModel, MetrikaEventOptionsModel } from './models';
import { delayedRetry } from '#shared/utils';
import { from, Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserStateService } from './user-state.service';

@Injectable()
export class ExternalProvidersService {
  private _renderer: Renderer2;
  private _yandexTranslatePopupEl: HTMLElement = null;
  private _yandexMetrikaPrevPath = this._location.path();

  constructor(
    private _rendererFactory: RendererFactory2,
    private _location: Location,
    private _metrika: Metrika,
    private _userStateService: UserStateService,
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

  hitYandexMetrika(): void {
    const newPath = this._location.path();
    this._metrika.hit(newPath, {
      referer: this._yandexMetrikaPrevPath,
    });
    this._yandexMetrikaPrevPath = newPath;
  }

  fireYandexMetrikaEvent(eventType: MetrikaEventTypeModel, options?: MetrikaEventOptionsModel): Observable<any> {
    const login = this._userStateService.userData$.getValue()?.userInfo.login;
    const opts = options;
    if (opts?.params && login) {
      opts.params['логин'] = login;
    }
    return of(null).pipe(
      switchMap(() => {
        return from(!opts ? this._metrika.fireEvent(eventType) : this._metrika.fireEvent(eventType, opts));
      }),
      switchMap((res) => {
        return !res ? throwError(null) : of(res);
      }),
      delayedRetry(300, 5),
    );
  }
}
