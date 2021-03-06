import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PaymentDocumentModule } from '#shared/modules/components/payment-document';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzTableModule,
    NzSpinModule,
    NzIconModule,
    InfiniteScrollModule,
    SharedDepsModule,
    PaymentDocumentModule,
    NzToolTipModule,
  ],
  exports: [OrderListComponent],
  declarations: [OrderListComponent],
})
export class OrderListModule {
}
