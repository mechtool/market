import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductGalleryComponent } from './product-gallery.component';
import { NzCarouselModule } from 'ng-zorro-antd';
import { PipesModule } from '#shared/modules/pipes';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzCarouselModule,
    PipesModule
  ],
  exports: [ProductGalleryComponent],
  declarations: [ProductGalleryComponent],
})
export class ProductGalleryModule {
}
