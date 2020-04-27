import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierListComponent, SupplierProductComponent, SupplierSingleComponent } from './components';
import { SearchBarModule, SupplierCardModule } from '#shared/modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SupplierRoutingModule,
    SearchBarModule,
    SupplierCardModule,
  ],
  declarations: [
    SupplierListComponent,
    SupplierSingleComponent,
    SupplierProductComponent,
  ],
})
export class SupplierModule {
}
