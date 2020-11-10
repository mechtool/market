import { Injectable } from '@angular/core';
import { OrderUnavailableComponent } from './components/order/components/order-unavailable';
import { OrderSentComponent } from './components/order/components/order-sent';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable()
export class CartModalService {
  constructor(private _modalService: NzModalService) {}

  openOrderUnavailableModal() {
    const modal = this._modalService.create({
      nzContent: OrderUnavailableComponent,
      nzFooter: null,
      nzWidth: 480,
    });
  }

  openOrderSentModal() {
    const modal = this._modalService.create({
      nzContent: OrderSentComponent,
      nzFooter: null,
      nzWidth: 480,
    });
    modal.componentInstance.destroyModalChange.subscribe(() => {
      modal.destroy();
    });
  }
}
