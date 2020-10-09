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
  SearchAreaModule,
  ProductOrderModule,
  SearchBarModule,
  SearchResultsModule,
  SorterModule,
  TradeOfferCardModule,
} from '#shared/modules';
import { DeclensionPipe } from '#shared/modules/pipes/declension.pipe';
import { BannersModule } from '#shared/modules/components/banners/banner.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    NomenclatureCardModule,
    SearchAreaModule,
    SearchResultsModule,
    SearchBarModule,
    TradeOfferCardModule,
    ErrorCodeAlertModule,
    NzTabsModule,
    NzAlertModule,
    PipesModule,
    ProductDescriptionModule,
    ProductGalleryModule,
    NzCarouselModule,
    CardModule,
    BannersModule,
    ProductOrderModule,
    SorterModule,
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
export class ProductModule {
}
