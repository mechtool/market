import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductSideComponent } from './product-side.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzIconModule, NzSpinModule } from 'ng-zorro-antd';
import { SpinnerModule } from '#shared/modules/components/spinner';

@NgModule({
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NzIconModule, NzSpinModule, SpinnerModule],
  exports: [ProductSideComponent],
  declarations: [ProductSideComponent],
})
export class ProductSideModule {}
