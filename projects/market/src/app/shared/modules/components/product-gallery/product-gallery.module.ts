import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductGalleryComponent } from './product-gallery.component';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@NgModule({
  imports: [CommonModule, RouterModule, NzCarouselModule, SharedDepsModule],
  exports: [ProductGalleryComponent],
  declarations: [ProductGalleryComponent],
})
export class ProductGalleryModule {}
