import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierListComponent, SupplierSingleComponent, TradeOfferComponent } from './components';
import {
  AboutSupplierModule,
  CardModule,
  ProductDescriptionModule,
  ProductGalleryModule,
  ProductOrderModule,
  SearchAreaModule,
  SupplierSearchBarModule,
  SupplierCardModule,
  TermsOfSaleModule,
} from '#shared/modules';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SupplierTradeOffersListModule } from '#shared/modules/components/supplier-trade-offers-list';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TradeOfferUnavailabilityComponent } from './components/trade-offer-unavailability/trade-offer-unavailability.component';
import {NzButtonModule} from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SupplierRoutingModule,
    SupplierSearchBarModule,
    SupplierCardModule,
    NzSpinModule,
    NzIconModule,
    NzButtonModule,
    SharedDepsModule,
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
    NzToolTipModule,
  ],
  declarations: [
    SupplierListComponent,
    SupplierSingleComponent,
    TradeOfferComponent,
    TradeOfferUnavailabilityComponent
  ],
})
export class SupplierModule {
}
