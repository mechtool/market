import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutSupplierComponent } from './about-supplier.component';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedDepsModule,
  ],
  exports: [AboutSupplierComponent],
  declarations: [AboutSupplierComponent],
})
export class AboutSupplierModule {
}
