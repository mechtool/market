import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierRoutingModule } from './supplier-routing.module';
import {
  SupplierListComponent,
  SupplierSingleComponent,
  SupplierProductComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SupplierRoutingModule,
  ],
  declarations: [
    SupplierListComponent,
    SupplierSingleComponent,
    SupplierProductComponent,
  ],
})
export class SupplierModule { }
