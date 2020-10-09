import { Injectable, OnDestroy } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { fromEvent, Subscription } from 'rxjs';
import { delay, filter, skip, take } from 'rxjs/operators';
import { NavigationService } from './navigation.service';
import { unsubscribeList } from '#shared/utils';

@Injectable()
export class OverlayService implements OnDestroy {
  private _overlayRef: OverlayRef = null;
  private _overlayClickOutsideSubscription: Subscription;
  private _overlayEscapeKeySubscription: Subscription;
  private _navBarWidthSubscription: Subscription;

  constructor(private _overlay: Overlay, private _navService: NavigationService) {
    this._navBarWidthSubscription = this._navService.isNavBarMinified$
      .pipe(
        filter(() => {
          return !!this._overlayRef;
        }),
        delay(100),
      )
      .subscribe(() => {
        this._overlayRef.updatePosition();
      });
  }

  ngOnDestroy() {
    unsubscribeList([this._overlayClickOutsideSubscription, this._overlayEscapeKeySubscription, this._navBarWidthSubscription]);
  }

  setOverlayRef(overlayRef: OverlayRef) {
    if (this._overlayRef) {
      this.resetOverlayRef();
    }
    if (this._overlayClickOutsideSubscription) {
      this._overlayClickOutsideSubscription.unsubscribe();
    }

    this._overlayRef = overlayRef;
    this._overlayClickOutsideSubscription = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        skip(1),
        filter((event) => {
          const clickTarget = event.target as HTMLElement;
          if (
            this._overlayRef.overlayElement &&
            !this._overlayRef.overlayElement.contains(clickTarget) &&
            !clickTarget.closest('.opener')
          ) {
            return true;
          }
        }),
        take(1),
      )
      .subscribe((event) => {
        this._overlayClickOutsideSubscription.unsubscribe();
        this.resetOverlayRef();
      });

    this._overlayEscapeKeySubscription = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((event) => event.code === 'Escape'),
        take(1),
      )
      .subscribe((event) => {
        this._overlayEscapeKeySubscription.unsubscribe();
        this.resetOverlayRef();
      });
  }

  isOverlayAttached(): boolean {
    return this._overlayRef && this._overlayRef.hasAttached();
  }

  resetOverlayRef(panelClass?: string) {
    if (this._overlayRef) {
      if (panelClass === this._overlayRef.getConfig().panelClass || !panelClass) {
        this._overlayRef.dispose();
      }
    }
  }
}
