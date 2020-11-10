import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductSideComponent } from './product-side.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from '#shared/modules/components/spinner';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NzIconModule, NzSpinModule, SpinnerModule],
  exports: [ProductSideComponent],
  declarations: [ProductSideComponent],
})
export class ProductSideModule {}
