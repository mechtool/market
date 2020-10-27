import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule, NzSpinModule } from 'ng-zorro-antd';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { NomenclatureCardModule, SearchBarModule, SearchResultsModule } from '#shared/modules';
import { ProductModule } from '../product';

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
