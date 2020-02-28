import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from './product-card.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [ProductCardComponent],
  declarations: [ProductCardComponent],
})
export class ProductCardModule { }
