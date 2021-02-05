import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierCardComponent } from './supplier-card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

@NgModule({
    imports: [CommonModule, RouterModule, NzButtonModule, NzToolTipModule, SharedDepsModule],
  exports: [SupplierCardComponent],
  declarations: [SupplierCardComponent],
})
export class SupplierCardModule {}
