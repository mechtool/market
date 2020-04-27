import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierCardComponent } from './supplier-card.component';
import { NzButtonModule } from 'ng-zorro-antd';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NzButtonModule,
  ],
  exports: [SupplierCardComponent],
  declarations: [SupplierCardComponent],
})
export class SupplierCardModule {

}
