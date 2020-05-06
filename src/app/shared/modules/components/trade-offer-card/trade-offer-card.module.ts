import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd';
import { TradeOfferCardComponent } from './trade-offer-card.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzButtonModule,
    NzToolTipModule,
  ],
  exports: [TradeOfferCardComponent],
  declarations: [TradeOfferCardComponent],
})
export class TradeOfferCardModule {

}
