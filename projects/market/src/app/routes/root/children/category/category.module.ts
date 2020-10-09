import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { SearchAreaModule } from '#shared/modules/components/search-area/search-area.module';
import { CategoryListModule } from '#shared/modules/components/category-list/category-list.module';
import { BannersModule } from '#shared/modules/components/banners/banner.module';
import { ProductModule } from '../product';
import { SearchResultsModule } from '#shared/modules/components/search-results/search-results.module';
import { TagModule } from '#shared/modules/components/tag';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CategoryRoutingModule,
    SearchAreaModule,
    CategoryListModule,
    BannersModule,
    ProductModule,
    SearchResultsModule,
    TagModule,
  ],
  declarations: [CategoryComponent],
})
export class CategoryModule {}
