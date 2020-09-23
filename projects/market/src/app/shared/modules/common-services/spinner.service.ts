import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { SpinnerOverlayComponent } from '#shared/modules/components/spinner';

@Injectable()
export class SpinnerService {
  private _overlayRef: OverlayRef = null;
  private _overlayConfig: OverlayConfig = new OverlayConfig({
    scrollStrategy: this._overlay.scrollStrategies.block(),
  });

  constructor(private _overlay: Overlay) {}

  show(message = '') {
    if (!this._overlayRef) {
      this._overlayRef = this._overlay.create(this._overlayConfig);
    }

    const spinnerOverlayPortal = new ComponentPortal(SpinnerOverlayComponent);
    const component = this._overlayRef.attach(spinnerOverlayPortal);
  }

  hide() {
    if (!!this._overlayRef) {
      this._overlayRef.detach();
    }
  }
}
