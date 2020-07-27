import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { NzTabsModule } from 'ng-zorro-antd';
import { AccountListModule, OrderListModule } from '#shared/modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OrdersRoutingModule,
    NzTabsModule,
    OrderListModule,
    AccountListModule,
  ],
  declarations: [
    OrdersComponent,
  ],
})
export class OrdersModule {
}
