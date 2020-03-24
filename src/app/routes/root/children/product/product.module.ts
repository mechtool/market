import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import {
  MainComponent,
  MainBannersComponent,
  MainBannersBannerComponent,
  MainPopularComponent,
  ProductComponent,
  Code404Component,
} from './components';
import { NomenclatureCardModule, BannerCardModule, SearchBarModule } from '#shared/modules';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    NomenclatureCardModule,
    BannerCardModule,
    SearchBarModule,
  ],
  declarations: [
    MainComponent,
    MainBannersComponent,
    MainBannersBannerComponent,
    MainPopularComponent,
    ProductComponent,
    Code404Component,
  ],
})
export class ProductModule { }
