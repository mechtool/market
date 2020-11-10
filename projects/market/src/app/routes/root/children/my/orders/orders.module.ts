import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { AccountListModule, OrderListModule } from '#shared/modules';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@NgModule({
  imports: [CommonModule, FormsModule, OrdersRoutingModule, NzTabsModule, OrderListModule, AccountListModule],
  declarations: [OrdersComponent],
})
export class OrdersModule {}
