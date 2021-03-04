import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupplierSearchBarComponent } from './supplier-search-bar.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    SharedDepsModule
  ],
  declarations: [
    SupplierSearchBarComponent,
  ],
  exports: [SupplierSearchBarComponent],
})
export class SupplierSearchBarModule {
}
