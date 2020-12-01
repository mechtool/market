import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartPromoterComponent } from './cart-promoter.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [CommonModule, RouterModule, NzButtonModule],
  exports: [CartPromoterComponent],
  declarations: [CartPromoterComponent],
})
export class CartPromoterModule {
}
