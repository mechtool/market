import { LineClampModule } from '#shared/modules/directives/line-clamp';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import {
  CartOrderComponent,
  CartOrderQtyCounterComponent,
  OrderSentComponent,
  OrderUnavailableComponent
} from './components';
import { CartModalService } from './cart-modal.service';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
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
    SharedDepsModule,
    CartRoutingModule,
    LineClampModule,
    NzInputModule,
    NgZorroAntdMobileModule,
    SharedDepsModule
  ],
  declarations: [
    CartComponent,
    CartOrderComponent,
    CartOrderQtyCounterComponent,
    OrderUnavailableComponent,
    OrderSentComponent,
  ],
  providers: [CartModalService],
})
export class CartModule {
}
