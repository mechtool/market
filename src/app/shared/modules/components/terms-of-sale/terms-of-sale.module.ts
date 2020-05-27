import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TermsOfSaleComponent } from './terms-of-sale.component';
import { PipesModule } from '#shared/modules/pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
  ],
  exports: [TermsOfSaleComponent],
  declarations: [TermsOfSaleComponent],
})
export class TermsOfSaleModule {

}
