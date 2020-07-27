import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NomenclatureCardComponent } from './nomenclature-card.component';
import { PipesModule } from '../../pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
  ],
  exports: [NomenclatureCardComponent],
  declarations: [NomenclatureCardComponent],
})
export class NomenclatureCardModule { }
