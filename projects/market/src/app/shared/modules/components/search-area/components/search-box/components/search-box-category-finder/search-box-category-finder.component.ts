import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, OnDestroy, OnInit } from '@angular/core';
import { SearchAreaService } from '../../../../search-area.service';
import { CategoryItemModel } from '../../../../models/category-item.model';
import { map, take } from 'rxjs/operators';
import { SearchBoxCategoryFinderAllComponent } from '../search-box-category-finder-all/search-box-category-finder-all.component';
import { Subscription } from 'rxjs';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';

@Component({
  selector: 'market-search-box-category-finder',
  templateUrl: './search-box-category-finder.component.html',
  styleUrls: [
    './search-box-category-finder.component.scss',
    './search-box-category-finder.component-768.scss',
    './search-box-category-finder.component-576.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxCategoryFinderComponent implements OnInit, OnDestroy {
  categories: CategoryItemModel[];
  private _categoriesSubscription: Subscription;

  constructor(
    private _searchAreaService: SearchAreaService,
    private _cdr: ChangeDetectorRef,
    private _el: ElementRef,
    private _injector: Injector,
    private _overlay: Overlay,
  ) {}

  ngOnInit() {
    this._initCategories();
  }

  ngOnDestroy() {
    this._categoriesSubscription.unsubscribe();
  }

  private _initCategories() {
    this._categoriesSubscription = this._searchAreaService.categories$
      .pipe(
        map((categories) => {
          return categories.map((cat) => {
            const children = !cat.children?.length
              ? []
              : cat.children.map((childCat) => {
                  return {
                    id: childCat.id,
                    name: childCat.name,
                  };
                });
            return {
              children,
              id: cat.id,
              name: cat.name,
            };
          });
        }),
        take(1),
      )
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  setSelectedCategoryItem(item: CategoryItemModel) {
    this._searchAreaService.categorySelectedItem$.next(item);
  }

  showAllCategories() {
    const cfg = new OverlayConfig({
      panelClass: 'panel_category-finder-all',
      scrollStrategy: this._overlay.scrollStrategies.block(),
    });
    this._searchAreaService.openOverlay(SearchBoxCategoryFinderAllComponent, cfg, null, this._injector);
  }

  close() {
    this._searchAreaService.closeOverlay();
  }
}
