import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Location } from '@angular/common';
import { Metrika } from 'ng-yandex-metrika';
import { MetrikaEventModel } from '#shared/modules/common-services/models';

@Injectable()
export class ExternalProvidersService {
  private _renderer: Renderer2;
  private _yandexTranslatePopupEl: HTMLElement = null;
  private _yandexMetrikaPrevPath = this._location.path();

  constructor(private _rendererFactory: RendererFactory2, private _location: Location, private _metrika: Metrika) {
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

  fireYandexMetrikaEvent(eventType: MetrikaEventModel): void {
    this._metrika.fireEvent(eventType);
  }
}
