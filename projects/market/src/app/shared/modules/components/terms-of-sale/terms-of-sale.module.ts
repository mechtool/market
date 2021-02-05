import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TermsOfSaleComponent } from './terms-of-sale.component';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedDepsModule,
  ],
  exports: [TermsOfSaleComponent],
  declarations: [TermsOfSaleComponent],
})
export class TermsOfSaleModule {

}
