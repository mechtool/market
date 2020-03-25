import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SearchResultComponent } from './components/result/result.component';
import { NomenclatureCardModule, BannerCardModule, SearchBarModule } from '#shared/modules';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SearchRoutingModule,
    NomenclatureCardModule,
    BannerCardModule,
    SearchBarModule,
  ],
  declarations: [
    SearchComponent,
    SearchResultComponent,
  ],
})
export class SearchModule { }
