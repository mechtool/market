import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierListComponent, SupplierSingleComponent, TradeOfferComponent } from './components';
import {
  AboutSupplierModule,
  CardModule,
  PipesModule,
  ProductDescriptionModule,
  ProductGalleryModule,
  ProductOrderModule,
  SearchAreaModule,
  SearchBarModule,
  SupplierCardModule,
  TermsOfSaleModule,
} from '#shared/modules';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SupplierTradeOffersListModule } from '#shared/modules/components/supplier-trade-offers-list';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SupplierRoutingModule,
    SearchBarModule,
    SupplierCardModule,
    NzSpinModule,
    NzIconModule,
    PipesModule,
    ProductGalleryModule,
    NzTabsModule,
    ProductDescriptionModule,
    TermsOfSaleModule,
    AboutSupplierModule,
    ProductOrderModule,
    CardModule,
    SupplierTradeOffersListModule,
    SearchAreaModule,
    VirtualScrollerModule,
  ],
  declarations: [SupplierListComponent, SupplierSingleComponent, TradeOfferComponent],
})
export class SupplierModule {
}
