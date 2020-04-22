import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import {
  Code404Component,
  GalleryComponent,
  MainBannersBannerComponent,
  MainBannersComponent,
  MainComponent,
  MainPopularComponent,
  ProductComponent,
} from './components';
import { BannerCardModule, NomenclatureCardModule, SearchBarModule, SearchResultsModule } from '#shared/modules';
import { NzCarouselModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    NomenclatureCardModule,
    BannerCardModule,
    SearchResultsModule,
    SearchBarModule,
    NzCarouselModule,
  ],
  declarations: [
    Code404Component,
    GalleryComponent,
    MainBannersBannerComponent,
    MainBannersComponent,
    MainComponent,
    MainPopularComponent,
    ProductComponent,
  ],
})
export class ProductModule {
}
