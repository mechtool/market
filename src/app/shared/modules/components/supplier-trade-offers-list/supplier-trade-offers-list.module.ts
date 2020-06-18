import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierTradeOffersListComponent } from './supplier-trade-offers-list.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SearchBarModule } from '#shared/modules/components/search-bar';
import { NzIconModule, NzSpinModule } from 'ng-zorro-antd';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzToolTipModule,
    SearchBarModule,
    NzIconModule,
    NzSpinModule,
    InfiniteScrollModule,
  ],
  exports: [SupplierTradeOffersListComponent],
  declarations: [SupplierTradeOffersListComponent],
})

export class SupplierTradeOffersListModule {

}
