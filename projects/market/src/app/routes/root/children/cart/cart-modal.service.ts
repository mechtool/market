import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrderSentComponent, RegisterOrderSentComponent } from './components';

@Injectable()
export class CartModalService {
  constructor(private _modalService: NzModalService) {
  }

  openOrderSentModal(isOrderType: boolean): void {
    const modal = this._modalService.create({
      nzContent: OrderSentComponent,
      nzFooter: null,
      nzWidth: 480,
      nzComponentParams: {
        isOrderType,
      }
    });
    modal.componentInstance.destroyModalChange.subscribe(() => {
      modal.destroy();
    });
  }

  openRegisterAndOrderSentModal(isOrderType: boolean, isAnonymous: boolean, inn: string, kpp: string): void {
    const modal = this._modalService.create({
      nzContent: RegisterOrderSentComponent,
      nzFooter: null,
      nzWidth: 480,
      nzComponentParams: {
        isOrderType,
        isAnonymous,
        inn,
        kpp
      }
    });
    modal.componentInstance.destroyModalChange.subscribe(() => {
      modal.destroy();
    });
  }
}
