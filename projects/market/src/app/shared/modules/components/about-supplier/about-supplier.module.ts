import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutSupplierComponent } from './about-supplier.component';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedDepsModule,
    NzMenuModule,
    NzCollapseModule,
    NzToolTipModule,
  ],
  exports: [AboutSupplierComponent],
  declarations: [AboutSupplierComponent],
})
export class AboutSupplierModule {
}
