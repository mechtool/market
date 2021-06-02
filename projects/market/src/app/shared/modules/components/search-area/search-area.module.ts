import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObserversModule } from '@angular/cdk/observers';
import { SearchAreaService } from './search-area.service';
import { SearchAreaComponent } from './search-area.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { SearchBoxInputComponent } from './components/search-box/components/search-box-input/search-box-input.component';
import { SearchBoxResultsComponent } from './components/search-box/components/search-box-results/search-box-results.component';
import { SearchBoxBtnComponent } from './components/search-box/components/search-box-btn/search-box-btn.component';
import { SearchBoxBtnCategoriesComponent } from './components/search-box/components/search-box-btn-categories/search-box-btn-categories.component';
import { SearchBoxHistoryComponent } from './components/search-box/components/search-box-history/search-box-history.component';
import { SearchBoxProductsComponent } from './components/search-box/components/search-box-products/search-box-products.component';
import { SearchBoxItemComponent } from './components/search-box/components/search-box-item/search-box-item.component';
import { SearchBoxCategoryFinderComponent } from './components/search-box/components/search-box-category-finder/search-box-category-finder.component';
import { SearchBoxCategoryFinderAllComponent } from './components/search-box/components/search-box-category-finder-all/search-box-category-finder-all.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { SpinnerModule } from '#shared/modules/components/spinner/spinner.module';
import { ClickOutsideModule } from '#shared/modules/directives/click-outside/click-outside.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FILTER_FORM_CONFIG, filterFormDefaultConfig } from './config';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ObserversModule,
    NzButtonModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzFormModule,
    NzInputModule,
    NzSliderModule,
    NzAutocompleteModule,
    NzIconModule,
    ScrollingModule,
    SpinnerModule,
    ClickOutsideModule,
    SharedDepsModule,
    NzDatePickerModule,
  ],
  declarations: [
    SearchAreaComponent,
    SearchBoxComponent,
    SearchBoxInputComponent,
    SearchBoxResultsComponent,
    SearchBoxBtnComponent,
    SearchBoxBtnCategoriesComponent,
    SearchBoxHistoryComponent,
    SearchBoxProductsComponent,
    SearchBoxItemComponent,
    SearchBoxCategoryFinderComponent,
    SearchBoxCategoryFinderAllComponent,
    SearchFilterComponent,
  ],
  providers: [SearchAreaService],
  exports: [SearchAreaComponent, SearchBoxComponent],
})
export class SearchAreaModule {
}
