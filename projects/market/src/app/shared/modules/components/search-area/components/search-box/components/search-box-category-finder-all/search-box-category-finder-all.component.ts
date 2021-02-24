import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '#shared/modules/common-services/navigation.service';
import { SearchAreaService } from '../../../../search-area.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CategoryModel } from '#shared/modules/common-services/models/category.model';
import { CategoryItemModel } from '../../../../models/category-item.model';
import { debounceTime, distinctUntilChanged, filter, take } from 'rxjs/operators';
import { unsubscribeList } from '#shared/utils';

const SCREEN_WIDTH_BREAKPOINT = 768;

@Component({
  selector: 'market-search-box-category-finder-all',
  templateUrl: './search-box-category-finder-all.component.html',
  styleUrls: [
    './search-box-category-finder-all.component.scss',
    './search-box-category-finder-all.component-992.scss',
    './search-box-category-finder-all.component-768.scss',
    './search-box-category-finder-all.component-576.scss',
  ],
})
export class SearchBoxCategoryFinderAllComponent implements OnInit, OnDestroy {
  categories: CategoryModel[];
  activeCategory: CategoryItemModel = null;
  mouseEnterCategoryChanges$: BehaviorSubject<CategoryModel> = new BehaviorSubject(null);
  isMobileRootCategorySelected = false;

  private _categoriesSubscription: Subscription;
  private _mouseEnterCategoryChangesSubscription: Subscription;

  get isNavBarMinified(): boolean {
    return this._navService.isNavBarMinified;
  }

  constructor(private _el: ElementRef, private _navService: NavigationService, private _searchAreaService: SearchAreaService) {}

  ngOnInit() {
    this._setCategories();
    this._setMouseEnterSubscription();
  }

  ngOnDestroy() {
    unsubscribeList([this._categoriesSubscription, this._mouseEnterCategoryChangesSubscription]);
  }

  private _setCategories(): void {
    this._categoriesSubscription = this._searchAreaService.categories$.subscribe((res) => {
      this.categories = res;
      this.activeCategory = this.categories?.[0];
    });
  }

  private _setMouseEnterSubscription(): void {
    this._mouseEnterCategoryChangesSubscription = this.mouseEnterCategoryChanges$
      .pipe(
        distinctUntilChanged(),
        filter((category) => !!category && this._searchAreaService.screenWidthGreaterThan(SCREEN_WIDTH_BREAKPOINT)),
        debounceTime(this._searchAreaService.debounceTime),
      )
      .subscribe((res) => {
        this.activeCategory = res;
      });
  }

  close(): void {
    this._searchAreaService.closeOverlay();
  }

  handleRootCategoryClick(item: CategoryItemModel): void {
    if (this._searchAreaService.screenWidthGreaterThan(SCREEN_WIDTH_BREAKPOINT)) {
      this.setSelectedCategoryItem(item);
    }
    if (!this._searchAreaService.screenWidthGreaterThan(SCREEN_WIDTH_BREAKPOINT)) {
      this.activeCategory = item;
      this.isMobileRootCategorySelected = true;
    }
  }

  setSelectedCategoryItem(item: CategoryItemModel): void {
    this._searchAreaService.categorySelectedItem$.next(item);
  }
}
