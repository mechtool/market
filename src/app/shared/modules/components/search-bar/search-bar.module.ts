import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';
import {
  SearchBarFilterComponent,
  SearchBarHistoryComponent,
  SearchBarItemComponent,
  SearchBarLocationComponent,
  SearchBarProductsComponent,
  SorterComponent
} from './components';
import {
  NzAutocompleteModule,
  NzButtonModule,
  NzCheckboxModule,
  NzDropDownModule,
  NzFormModule,
  NzInputModule,
  NzRadioModule,
  NzSliderModule,
} from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzSliderModule,
    NzAutocompleteModule,
  ],
  declarations: [
    SearchBarComponent,
    SearchBarHistoryComponent,
    SearchBarItemComponent,
    SearchBarProductsComponent,
    SearchBarFilterComponent,
    SearchBarLocationComponent,
    SorterComponent,
  ],
  exports: [SearchBarComponent],
})
export class SearchBarModule {
}

