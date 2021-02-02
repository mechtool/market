import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { SpinnerOverlayComponent } from '#shared/modules/components/spinner';
import { CustomBlockScrollStrategy } from '../../../config/custom-block-scroll-strategy';

@Injectable()
export class SpinnerService {
  private _overlayRef: OverlayRef = null;
  private _overlayConfig: OverlayConfig = new OverlayConfig({
    scrollStrategy: new CustomBlockScrollStrategy(),
  });

  constructor(private _overlay: Overlay) {}

  show(message = '') {
    if (!this._overlayRef) {
      this._overlayRef = this._overlay.create(this._overlayConfig);
    }

    if (!this._overlayRef.hasAttached()) {
      const spinnerOverlayPortal = new ComponentPortal(SpinnerOverlayComponent);
      const component = this._overlayRef.attach(spinnerOverlayPortal);
    }
  }

  hide() {
    this._overlayRef?.detach();
  }
}
