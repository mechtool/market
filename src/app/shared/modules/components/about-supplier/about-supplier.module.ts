import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutSupplierComponent } from './about-supplier.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [AboutSupplierComponent],
  declarations: [AboutSupplierComponent],
})
export class AboutSupplierModule {
}
