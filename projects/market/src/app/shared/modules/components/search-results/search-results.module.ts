import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchResultComponent } from './search-results.component';
import { NomenclatureCardModule } from '../nomenclature-card';
import { CardModule } from '../card/card.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipesModule } from '#shared/modules/pipes';
import { SorterModule } from '../sorter';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

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
    PipesModule,
    SorterModule,
    VirtualScrollerModule,
  ],
  declarations: [SearchResultComponent],
  exports: [SearchResultComponent],
})
export class SearchResultsModule {}
