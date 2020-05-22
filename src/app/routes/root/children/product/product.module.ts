import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import {
  Code404Component,
  Code500Component,
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
  ProductDescriptionModule,
  SearchBarModule,
  SearchResultsModule,
  TradeOfferCardModule,
  ErrorCodeAlertModule,
} from '#shared/modules';
import {
  NzCarouselModule,
  NzDropDownModule,
  NzTabsModule,
  NzAlertModule,
} from 'ng-zorro-antd';
import { DeclensionPipe } from '#shared/modules/pipes/declension.pipe';

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
    ErrorCodeAlertModule,
    NzDropDownModule,
    NzTabsModule,
    NzAlertModule,
    PipesModule,
    ProductDescriptionModule,
  ],
  declarations: [
    Code404Component,
    Code500Component,
    GalleryComponent,
    MainBannersBannerComponent,
    MainBannersComponent,
    MainComponent,
    MainPopularComponent,
    ProductComponent,
    TradeOfferCardsListComponent,
  ],
  providers: [DeclensionPipe],
})
export class ProductModule {}
