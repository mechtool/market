import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NomenclatureCardComponent } from './nomenclature-card.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [NomenclatureCardComponent],
  declarations: [NomenclatureCardComponent],
})
export class NomenclatureCardModule { }
