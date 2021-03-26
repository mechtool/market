import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductGalleryComponent } from './product-gallery.component';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzImageModule } from 'ng-zorro-antd/image';

@NgModule({
  imports: [CommonModule, RouterModule, NzCarouselModule, SharedDepsModule, NzToolTipModule, NzImageModule],
  exports: [ProductGalleryComponent],
  declarations: [ProductGalleryComponent],
})
export class ProductGalleryModule {
}
