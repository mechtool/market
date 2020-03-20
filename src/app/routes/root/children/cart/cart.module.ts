import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CartRoutingModule,
  ],
  declarations: [
    CartComponent,
  ],
})
export class CartModule { }
