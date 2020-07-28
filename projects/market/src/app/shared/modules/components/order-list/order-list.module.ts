import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list.component';
import { NzIconModule, NzSpinModule, NzTableModule } from 'ng-zorro-antd';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipesModule } from '#shared/modules/pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzTableModule,
    NzSpinModule,
    InfiniteScrollModule,
    NzIconModule,
    PipesModule,
  ],
  exports: [OrderListComponent],
  declarations: [OrderListComponent],
})
export class OrderListModule {
}