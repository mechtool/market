import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '#shared/modules/pipes/pipes.module';
import {
  NzFormModule,
  NzDropDownModule,
  NzTabsModule,
  NzToolTipModule,
  NzRadioModule,
  NzButtonModule,
  NzAutocompleteModule,
  NzEmptyModule,
  NzDatePickerModule,
} from 'ng-zorro-antd';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { CartOrderComponent, CartOrderQtyCounterComponent } from './components';
import { NgxMaskModule } from 'ngx-mask';

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
  ],
  declarations: [
    CartComponent,
    CartOrderComponent,
    CartOrderQtyCounterComponent,
  ],
})
export class CartModule {
}
