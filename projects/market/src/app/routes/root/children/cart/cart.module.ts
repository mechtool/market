import { LineClampModule } from './../../../../shared/modules/directives/line-clamp/line-clamp.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '#shared/modules/pipes/pipes.module';
import {
  NzAutocompleteModule,
  NzButtonModule,
  NzDatePickerModule,
  NzDropDownModule,
  NzEmptyModule,
  NzFormModule,
  NzInputModule,
  NzRadioModule,
  NzTabsModule,
  NzToolTipModule,
} from 'ng-zorro-antd';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { CartOrderComponent, CartOrderQtyCounterComponent, OrderSentComponent } from './components';
import { NgxMaskModule } from 'ngx-mask';
import { CartModalService } from './cart-modal.service';
import { OrderUnavailableComponent } from './components/order/components/order-unavailable';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzDropDownModule,
    NzTabsModule,
    NzToolTipModule,
    NzRadioModule,
    NzButtonModule,
    NzAutocompleteModule,
    NzModalModule,
    NzEmptyModule,
    NzDatePickerModule,
    NgxMaskModule,
    CartRoutingModule,
    PipesModule,
    LineClampModule,
    NzInputModule,
    NgZorroAntdMobileModule,
  ],
  declarations: [
    CartComponent,
    CartOrderComponent,
    CartOrderQtyCounterComponent,
    OrderUnavailableComponent,
    OrderSentComponent,
  ],
  providers: [CartModalService]
})
export class CartModule {
}
