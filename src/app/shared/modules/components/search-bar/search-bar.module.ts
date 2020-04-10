import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';
import { SearchBarHistoryComponent } from './components/history/history.component';
import { SearchBarItemComponent } from './components/item/item.component';
import { SearchBarProductsComponent } from './components/products/products.component';
import { SearchBarFilterComponent } from './components/search-bar-filter/search-bar-filter.component';
import { SearchBarLocationComponent } from './components/search-bar-location/search-bar-location.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzDropDownModule,
  ],
  declarations: [
    SearchBarComponent,
    SearchBarHistoryComponent,
    SearchBarItemComponent,
    SearchBarProductsComponent,
    SearchBarFilterComponent,
    SearchBarLocationComponent
  ],
  exports: [SearchBarComponent],
})
export class SearchBarModule { }

