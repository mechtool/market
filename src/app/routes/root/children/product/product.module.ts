import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import {
  Code404Component,
  Code500Component,
  MainBannersBannerComponent,
  MainBannersComponent,
  MainComponent,
  MainPopularComponent,
  ProductComponent,
  TradeOfferCardsListComponent,
} from './components';
import {
  BannerCardModule,
  ErrorCodeAlertModule,
  NomenclatureCardModule,
  PipesModule,
  ProductDescriptionModule,
  ProductGalleryModule,
  SearchBarModule,
  SearchResultsModule,
  TradeOfferCardModule,
  CardModule,
} from '#shared/modules';
import { NzAlertModule, NzCarouselModule, NzDropDownModule, NzTabsModule, } from 'ng-zorro-antd';
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
    TradeOfferCardModule,
    ErrorCodeAlertModule,
    NzDropDownModule,
    NzTabsModule,
    NzAlertModule,
    PipesModule,
    ProductDescriptionModule,
    ProductGalleryModule,
    NzCarouselModule,
    CardModule,
  ],
  declarations: [
    Code404Component,
    Code500Component,
    MainBannersBannerComponent,
    MainBannersComponent,
    MainBannersBannerComponent,
    MainComponent,
    MainPopularComponent,
    ProductComponent,
    TradeOfferCardsListComponent,
  ],
  providers: [DeclensionPipe],
  exports: [
    MainPopularComponent
  ]
})
export class ProductModule {
}
