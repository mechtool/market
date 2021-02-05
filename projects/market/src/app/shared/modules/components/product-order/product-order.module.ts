import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductOrderComponent } from './product-order.component';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ProductSideModule } from '#shared/modules/components/product-side';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  imports: [CommonModule, RouterModule, SharedDepsModule, ReactiveFormsModule, NzModalModule, NzToolTipModule, ProductSideModule],
  exports: [ProductOrderComponent],
  declarations: [ProductOrderComponent],
})
export class ProductOrderModule {}
