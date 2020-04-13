import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CheckoutRoutingModule,
  ],
  declarations: [
    CheckoutComponent,
  ],
})
export class CheckoutModule {
}
