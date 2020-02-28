import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasketRoutingModule } from './basket-routing.module';
import { BasketComponent } from './basket.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BasketRoutingModule,
  ],
  declarations: [
    BasketComponent,
  ],
})
export class BasketModule { }
