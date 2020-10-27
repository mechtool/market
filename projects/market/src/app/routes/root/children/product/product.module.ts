import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import {
  Code404Component,
  Code500Component,
  MainBannersComponent,
  MainComponent,
  MainPopularComponent,
  ProductComponent,
  TradeOfferCardsListComponent,
} from './components';
import {
  CardModule,
  ErrorCodeAlertModule,
  NomenclatureCardModule,
  PipesModule,
  ProductDescriptionModule,
  ProductGalleryModule,
  SearchBarModule,
  SearchResultsModule,
  TradeOfferCardModule,
} from '#shared/modules';
import { NzAlertModule, NzCarouselModule, NzDropDownModule, NzTabsModule } from 'ng-zorro-antd';
import { DeclensionPipe } from '#shared/modules/pipes/declension.pipe';
import { BannersModule } from '#shared/modules/components/banners/banner.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    NomenclatureCardModule,
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
    BannersModule,
  ],
  declarations: [
    Code404Component,
    Code500Component,
    MainBannersComponent,
    MainComponent,
    MainPopularComponent,
    ProductComponent,
    TradeOfferCardsListComponent,
  ],
  providers: [DeclensionPipe],
  exports: [MainPopularComponent, MainBannersComponent],
})
export class ProductModule {}
