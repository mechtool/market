import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent, CategorySingleComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CategoryRoutingModule,
  ],
  declarations: [
    CategoryListComponent,
    CategorySingleComponent,
  ],
})
export class CategoryModule { }
