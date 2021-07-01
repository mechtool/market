import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NomenclatureCardModule } from '#shared/modules/components/nomenclature-card';
import { CardModule } from '#shared/modules/components/card';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SorterModule } from '../sorter';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { SearchResultComponent } from './search-results.component';
import { SearchResultsService } from './search-results.service';

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
    SharedDepsModule,
    SorterModule,
    VirtualScrollerModule,
  ],
  providers: [SearchResultsService],
  declarations: [SearchResultComponent],
  exports: [SearchResultComponent],
})
export class SearchResultsModule {
}
