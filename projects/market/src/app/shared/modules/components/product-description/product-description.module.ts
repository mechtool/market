import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductDescriptionComponent } from './product-description.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [ProductDescriptionComponent],
  declarations: [ProductDescriptionComponent],
})
export class ProductDescriptionModule {
}
