import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NomenclatureCardComponent } from './nomenclature-card.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

@NgModule({
  imports: [CommonModule, RouterModule, NzToolTipModule, SharedDepsModule],
  exports: [NomenclatureCardComponent],
  declarations: [NomenclatureCardComponent],
})
export class NomenclatureCardModule {}
