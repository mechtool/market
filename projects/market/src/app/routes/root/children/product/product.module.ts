import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import {
  Code404Component,
  Code500Component,
  MainComponent,
  MainPopularComponent,
  ProductComponent,
  ProductRangeComponent,
  TradeOfferCardsListComponent,
} from './components';
import {
  CardModule,
  ErrorCodeAlertModule,
  NomenclatureCardModule,
  ProductDescriptionModule,
  ProductGalleryModule,
  ProductOrderModule,
  SearchAreaModule,
  SearchResultsModule,
  SorterModule,
  SupplierSearchBarModule,
  TradeOfferCardModule,
} from '#shared/modules/components';
import { DeclensionPipe } from '#shared/modules/pipes/declension.pipe';
import { BannersModule } from '#shared/modules/components/banners/banner.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
    SupplierSearchBarModule,
    TradeOfferCardModule,
    ErrorCodeAlertModule,
    NzTabsModule,
    NzAlertModule,
    SharedDepsModule,
    ProductDescriptionModule,
    ProductGalleryModule,
    NzCarouselModule,
    CardModule,
    BannersModule,
    ProductOrderModule,
    SorterModule,
    NzGridModule,
    NzButtonModule,
  ],
  declarations: [
    Code404Component,
    Code500Component,
    MainComponent,
    MainPopularComponent,
    ProductComponent,
    TradeOfferCardsListComponent,
    ProductRangeComponent,
  ],
  providers: [DeclensionPipe],
  exports: [MainPopularComponent, ProductRangeComponent],
})
export class ProductModule {
}
