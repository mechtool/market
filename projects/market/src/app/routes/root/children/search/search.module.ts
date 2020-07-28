import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { BannerCardModule, NomenclatureCardModule, SearchBarModule, SearchResultsModule } from '#shared/modules';
import { ProductModule } from '../product';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SearchRoutingModule,
    NomenclatureCardModule,
    BannerCardModule,
    SearchBarModule,
    SearchResultsModule,
    ProductModule,
  ],
  declarations: [
    SearchComponent,
  ],
})
export class SearchModule {
}