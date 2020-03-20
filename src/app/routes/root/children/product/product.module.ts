import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import {
  MainComponent,
  MainSearchComponent,
  MainSearchProductsComponent,
  MainSearchHistoryComponent,
  MainSearchItemComponent,
  MainBannersComponent,
  MainBannersBannerComponent,
  MainPopularComponent,
  ProductComponent,
  Code404Component,
} from './components';
import { SuggestionService } from './services';
import { NomenclatureCardModule, BannerCardModule } from '#shared/modules';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    NomenclatureCardModule,
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
    ProductComponent,
    Code404Component,
  ],
  providers: [SuggestionService],
})
export class ProductModule { }
