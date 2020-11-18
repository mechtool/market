import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierCardComponent } from './supplier-card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PipesModule } from '#shared/modules/pipes';

@NgModule({
    imports: [CommonModule, RouterModule, NzButtonModule, NzToolTipModule, PipesModule],
  exports: [SupplierCardComponent],
  declarations: [SupplierCardComponent],
})
export class SupplierCardModule {}
