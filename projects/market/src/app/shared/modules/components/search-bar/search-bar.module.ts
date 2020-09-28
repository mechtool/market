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
  SearchBarFilterCategoryComponent,
  SearchBarProductsComponent,
  SearchBarCategoryDesktopElementDirective,
  SearchBarCategoryMobileElementDirective,
} from './components';
import {
  NzAutocompleteModule,
  NzButtonModule,
  NzCheckboxModule,
  NzDropDownModule,
  NzFormModule,
  NzInputModule,
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
    SearchBarFilterCategoryComponent,
    SearchBarCategoryDesktopElementDirective,
    SearchBarCategoryMobileElementDirective,
  ],
  exports: [SearchBarComponent],
})
export class SearchBarModule {}
