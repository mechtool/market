import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountListComponent } from './account-list.component';
import { NzIconModule, NzSpinModule, NzTableModule } from 'ng-zorro-antd';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipesModule } from '#shared/modules/pipes';
import { PaymentDocumentModule } from '#shared/modules/components/payment-document';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzTableModule,
    NzSpinModule,
    NzIconModule,
    InfiniteScrollModule,
    PipesModule,
    PaymentDocumentModule,
  ],
  exports: [AccountListComponent],
  declarations: [AccountListComponent],
})
export class AccountListModule {
}
