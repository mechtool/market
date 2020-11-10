import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BannersComponent } from './banners.component';
import { BannerComponent } from './components/banner/banner.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@NgModule({
  imports: [CommonModule, RouterModule, NzCarouselModule],
  exports: [BannersComponent, BannerComponent],
  declarations: [BannersComponent, BannerComponent],
})
export class BannersModule {}
