import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar.component';
import { SearchBarHistoryComponent } from './components/history/history.component';
import { SearchBarItemComponent } from './components/item/item.component';
import { SearchBarProductsComponent } from './components/products/products.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SearchBarComponent,
    SearchBarHistoryComponent,
    SearchBarItemComponent,
    SearchBarProductsComponent,
  ],
  exports: [SearchBarComponent],
})
export class SearchBarModule { }

