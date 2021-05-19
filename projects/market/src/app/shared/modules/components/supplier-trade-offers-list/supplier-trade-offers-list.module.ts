import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierTradeOffersListComponent } from './supplier-trade-offers-list.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SupplierSearchBarModule } from '#shared/modules/components/supplier-search-bar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipesModule, ProductSideModule, SorterModule, SpinnerModule } from '#shared/modules';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzToolTipModule,
    SupplierSearchBarModule,
    NzIconModule,
    NzSpinModule,
    InfiniteScrollModule,
    ProductSideModule,
    SorterModule,
    SpinnerModule,
    SharedDepsModule,
    PipesModule,
  ],
  exports: [SupplierTradeOffersListComponent],
  declarations: [SupplierTradeOffersListComponent],
})
export class SupplierTradeOffersListModule {}
