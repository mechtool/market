import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoriesComponent, CategoryComponent } from './components';
import { CategoryListModule, SearchBarModule, SearchResultsModule } from '#shared/modules';
import { ProductModule } from '../product';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CategoryRoutingModule,
    CategoryListModule,
    SearchBarModule,
    SearchResultsModule,
    ProductModule,
  ],
  declarations: [
    CategoryComponent,
    CategoriesComponent,
  ],
})
export class CategoryModule {
}
