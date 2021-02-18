import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { AccountListModule, OrderListModule } from '#shared/modules';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  imports: [CommonModule, FormsModule, OrdersRoutingModule, NzTabsModule, OrderListModule, AccountListModule, NzButtonModule, NzIconModule],
  declarations: [OrdersComponent],
})
export class OrdersModule {}
