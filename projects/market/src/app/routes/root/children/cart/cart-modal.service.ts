import { Injectable } from '@angular/core';
import { RegisterOrderSentComponent } from './components/order/components/register-order-sent';
import { OrderUnavailableComponent } from './components/order/components/order-unavailable';
import { OrderSentComponent } from './components/order/components/order-sent';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable()
export class CartModalService {
  constructor(private _modalService: NzModalService) {}

  openOrderUnavailableModal(): void {
    this._modalService.create({
      nzContent: OrderUnavailableComponent,
      nzFooter: null,
      nzWidth: 480,
    });
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

  openRegisterAndOrderSentModal(isOrderType: boolean, isAnonymous: boolean): void {
    const modal = this._modalService.create({
      nzContent: RegisterOrderSentComponent,
      nzFooter: null,
      nzWidth: 480,
      nzComponentParams: {
        isOrderType,
        isAnonymous,
      }
    });
    modal.componentInstance.destroyModalChange.subscribe(() => {
      modal.destroy();
    });
  }
}
