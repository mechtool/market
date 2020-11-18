import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutSupplierComponent } from './about-supplier.component';
import { PipesModule } from '#shared/modules/pipes';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        PipesModule,
    ],
  exports: [AboutSupplierComponent],
  declarations: [AboutSupplierComponent],
})
export class AboutSupplierModule {
}
