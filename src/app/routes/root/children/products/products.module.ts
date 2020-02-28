import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import {
  MainComponent,
  MainSearchComponent,
  MainSearchProductsComponent,
  MainSearchHistoryComponent,
  MainSearchItemComponent,
  MainBannersComponent,
  MainBannersBannerComponent,
  MainPopularComponent,
  ProductsComponent,
  ProductComponent,
} from './components';
import { ProductsService } from './services';
import { ProductCardModule, BannerCardModule } from '#shared/modules';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule,
    ProductCardModule,
    BannerCardModule,
  ],
  declarations: [
    MainComponent,
    MainSearchComponent,
    MainSearchProductsComponent,
    MainSearchHistoryComponent,
    MainSearchItemComponent,
    MainBannersComponent,
    MainBannersBannerComponent,
    MainPopularComponent,
    ProductsComponent,
    ProductComponent
  ],
  providers: [
    ProductsService,
  ],
})
export class ProductsModule { }
