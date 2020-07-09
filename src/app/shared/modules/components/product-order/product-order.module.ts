import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductOrderComponent } from './product-order.component';
import { PipesModule } from '#shared/modules/pipes';
import { ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    ReactiveFormsModule,
    NzModalModule,
    NzToolTipModule,
  ],
  exports: [ProductOrderComponent],
  declarations: [ProductOrderComponent],
})
export class ProductOrderModule {
}
