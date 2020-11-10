import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierTradeOffersListComponent } from './supplier-trade-offers-list.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SearchBarModule } from '#shared/modules/components/search-bar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipesModule, ProductSideModule, SorterModule, SpinnerModule } from '#shared/modules';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzToolTipModule,
    SearchBarModule,
    NzIconModule,
    NzSpinModule,
    InfiniteScrollModule,
    ProductSideModule,
    PipesModule,
    SorterModule,
    SpinnerModule,
  ],
  exports: [SupplierTradeOffersListComponent],
  declarations: [SupplierTradeOffersListComponent],
})
export class SupplierTradeOffersListModule {}
