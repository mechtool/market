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
  TradeOfferCardsListComponent,
} from './components';
import {
  BannerCardModule,
  NomenclatureCardModule,
  PipesModule,
  SearchBarModule,
  SearchResultsModule,
  TradeOfferCardModule
} from '#shared/modules';
import { NzCarouselModule, NzDropDownModule } from 'ng-zorro-antd';


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
    TradeOfferCardModule,
    NzDropDownModule,
    PipesModule,
  ],
  declarations: [
    Code404Component,
    GalleryComponent,
    MainBannersBannerComponent,
    MainBannersComponent,
    MainComponent,
    MainPopularComponent,
    ProductComponent,
    TradeOfferCardsListComponent,
  ],
})
export class ProductModule {
}
