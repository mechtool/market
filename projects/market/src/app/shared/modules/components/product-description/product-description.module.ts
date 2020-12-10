import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductDescriptionComponent } from './product-description.component';
import { PipesModule } from '#shared/modules/pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
  ],
  exports: [ProductDescriptionComponent],
  declarations: [ProductDescriptionComponent],
})
export class ProductDescriptionModule {
}
