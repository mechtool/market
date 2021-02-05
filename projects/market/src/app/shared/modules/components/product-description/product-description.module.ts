import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductDescriptionComponent } from './product-description.component';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedDepsModule,
  ],
  exports: [ProductDescriptionComponent],
  declarations: [ProductDescriptionComponent],
})
export class ProductDescriptionModule {
}
