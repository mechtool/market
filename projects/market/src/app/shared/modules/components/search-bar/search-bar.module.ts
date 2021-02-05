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
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

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
    SharedDepsModule
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
