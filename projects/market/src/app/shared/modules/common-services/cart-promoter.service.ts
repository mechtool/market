import { Injectable } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CartPromoterComponent } from '#shared/modules/components/cart-promoter';

@Injectable()
export class CartPromoterService {

  readyGoToCart = true;

  constructor(private _idle: Idle,
              private _modalService: NzModalService,
  ) {
    _idle.setIdle(5);
    _idle.setTimeout(5);
    _idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    _idle.onTimeout.subscribe(() => {
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
