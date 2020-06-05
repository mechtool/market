import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchResultComponent } from './search-results.component';
import { NomenclatureCardModule } from '../nomenclature-card';
import { CardModule } from '../card/card.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NomenclatureCardModule,
    CardModule,
  ],
  declarations: [
    SearchResultComponent,
  ],
  exports: [SearchResultComponent],
})
export class SearchResultsModule {
}

