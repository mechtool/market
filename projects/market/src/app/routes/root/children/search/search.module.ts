import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { NomenclatureCardModule, SearchBarModule, SearchResultsModule } from '#shared/modules';
import { ProductModule } from '../product';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SearchRoutingModule,
    NomenclatureCardModule,
    SearchBarModule,
    SearchResultsModule,
    ProductModule,
    NzSpinModule,
    NzIconModule,
  ],
  declarations: [SearchComponent],
})
export class SearchModule {}
