import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductGalleryComponent } from './product-gallery.component';
import { NzCarouselModule } from 'ng-zorro-antd';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzCarouselModule
  ],
  exports: [ProductGalleryComponent],
  declarations: [ProductGalleryComponent],
})
export class ProductGalleryModule {
}
