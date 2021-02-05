import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TradeOfferCardComponent } from './trade-offer-card.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

@NgModule({
  imports: [CommonModule, RouterModule, NzButtonModule, NzToolTipModule, SharedDepsModule],
  exports: [TradeOfferCardComponent],
  declarations: [TradeOfferCardComponent],
})
export class TradeOfferCardModule {}
