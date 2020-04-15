import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryListComponent } from './category-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [CategoryListComponent],
  declarations: [CategoryListComponent],
})
export class CategoryListModule {
}
