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
} from 'ng-zorro-antd';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { CartOrderComponent, CartOrderQtyCounterComponent } from './components';

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
