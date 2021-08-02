import {Inject, Injectable, Injector, PLATFORM_ID} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CartPromoterComponent } from '../../../shared/modules/components/cart-promoter';
import {isPlatformBrowser} from '@angular/common';

@Injectable()
export class CartPromoterService {

  private _idle;
  readyGoToCart = true;

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private _injector : Injector,
    private _modalService: NzModalService,
  ) {
    if(isPlatformBrowser(this._platformId)){
      this.setUp();
    }
  }

  async setUp(){
    const m = await import('@ng-idle/core');
    this._idle = this._injector.get(m.Idle);
    this._idle.setIdle(5);
    this._idle.setTimeout(5);
    this._idle.setInterrupts(m.DEFAULT_INTERRUPTSOURCES);
    this._idle.onTimeout.subscribe(() => {
      this._openModal()
    });
  }
  start() {
    if (this.readyGoToCart && !this._idle.isRunning()) {
      this._idle.watch();
    }
  }

  stop() {
    if (this._idle.isRunning()) {
      this._idle.stop();
    }
  }

  private _openModal() {
    const modal = this._modalService.create({
      nzContent: CartPromoterComponent,
      nzFooter: null,
      nzWidth: 480,
    });

    modal.componentInstance.destroyModalChange.subscribe(() => {
      modal.destroy();
    });

    modal.afterClose.subscribe(() => {
      this.readyGoToCart = false;
    })
  }
}
