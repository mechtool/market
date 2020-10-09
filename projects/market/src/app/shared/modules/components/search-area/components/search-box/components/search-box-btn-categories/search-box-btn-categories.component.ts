import { Component, forwardRef, Injector, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayConfig, PositionStrategy } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { SearchBoxCategoryFinderComponent } from '../search-box-category-finder/search-box-category-finder.component';
import { SearchAreaService } from '../../../../search-area.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CategoryItemModel } from '../../../../models/category-item.model';
import { deepTreeSearch } from '#shared/utils';

const positionsPair: ConnectionPositionPair[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
  },
  {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
  },
];

@Component({
  selector: 'market-search-box-btn-categories',
  templateUrl: './search-box-btn-categories.component.html',
  styleUrls: ['./search-box-btn-categories.component.scss', './search-box-btn-categories.component-576.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBoxBtnCategoriesComponent),
      multi: true,
    },
  ],
})
export class SearchBoxBtnCategoriesComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private _categorySelected: CategoryItemModel;
  private _categorySelectedItemSubscription: Subscription;

  get categorySelected(): CategoryItemModel {
    return this._categorySelected;
  }

  set categorySelected(val: CategoryItemModel) {
    this._categorySelected = val;
    this.onChange(this._categorySelected?.id || '');
  }

  constructor(
    private _searchAreaService: SearchAreaService,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _injector: Injector,
  ) {}

  ngOnInit() {
    this._handleCategorySelectedItemChanges();
  }

  ngOnDestroy() {
    this._categorySelectedItemSubscription.unsubscribe();
  }

  openPanel(origin: HTMLElement): void {
    this._searchAreaService.openOverlay(
      SearchBoxCategoryFinderComponent,
      this._getOverlayConfig({ origin }),
      this._viewContainerRef,
      this._injector,
    );
  }

  deselectCategory(): void {
    this._searchAreaService.categorySelectedItem$.next(null);
  }

  private _handleCategorySelectedItemChanges(): void {
    this._categorySelectedItemSubscription = this._searchAreaService.categorySelectedItem$.subscribe((item) => {
      this.categorySelected = item || null;
      this._searchAreaService.closeOverlay();
    });
  }

  private _getOverlayConfig({ origin }): OverlayConfig {
    return new OverlayConfig({
      panelClass: 'panel_category-finder',
      positionStrategy: this._getOverlayPosition(origin),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
    });
  }

  private _getOverlayPosition(origin: HTMLElement): PositionStrategy {
    const positionStrategy = this._overlay.position().flexibleConnectedTo(origin).withPositions(positionsPair).withPush(false);
    return positionStrategy;
  }

  onChange(_: any) {}

  writeValue(val: string) {
    const categories = this._searchAreaService.categories$.getValue();
    this.categorySelected = deepTreeSearch(categories, 'id', (k, v) => v === val);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {}
}
