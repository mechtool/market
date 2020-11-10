import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductGalleryComponent } from './product-gallery.component';
import { PipesModule } from '#shared/modules/pipes';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@NgModule({
  imports: [CommonModule, RouterModule, NzCarouselModule, PipesModule],
  exports: [ProductGalleryComponent],
  declarations: [ProductGalleryComponent],
})
export class ProductGalleryModule {}
