import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchResultComponent } from './search-results.component';
import { NomenclatureCardModule } from '../nomenclature-card';
import { CardModule } from '../card/card.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NzIconModule, NzSpinModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NomenclatureCardModule,
    CardModule,
    InfiniteScrollModule,
    NzSpinModule,
    NzIconModule,
  ],
  declarations: [
    SearchResultComponent,
  ],
  exports: [SearchResultComponent],
})
export class SearchResultsModule {
}

