import { Component, forwardRef, Injector, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayConfig, PositionStrategy } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { SearchBoxCategoryFinderComponent } from '#shared/modules/components/search-area/components/search-box/components/search-box-category-finder/search-box-category-finder.component';
import { SearchAreaService } from '#shared/modules/components/search-area/search-area.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CategoryItemModel } from '#shared/modules/components/search-area/models/category-item.model';
import { unsubscribeList } from '#shared/utils';

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
  styleUrls: [
    './search-box-btn-categories.component.scss',
    './search-box-btn-categories.component-576.scss'
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBoxBtnCategoriesComponent),
      multi: true,
    },
  ],
})
export class SearchBoxBtnCategoriesComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private _categorySelected: CategoryItemModel = null;
  private _categorySelectedItemSubscription: Subscription;
  private _categoriesSubscription: Subscription;

  get categorySelected(): CategoryItemModel {
    return this._categorySelected;
  }

  set categorySelected(val: CategoryItemModel) {
    this._categorySelected = val;
    this.onChange(this._categorySelected?.id || '');
  }

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    private _searchAreaService: SearchAreaService,
    private _viewContainerRef: ViewContainerRef,
  ) {
  }

  ngOnInit() {
    this._handleCategorySelectedItemChanges();
  }

  ngOnDestroy() {
    unsubscribeList([this._categorySelectedItemSubscription, this._categoriesSubscription]);
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
    this._categorySelectedItemSubscription = this._searchAreaService.categorySelectedItem$
      .subscribe((category) => {
        this.categorySelected = category || null;
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
    return this._overlay.position().flexibleConnectedTo(origin).withPositions(positionsPair).withPush(false);
  }

  onChange(_: any) {
  }

  writeValue(val: string) {
    this._categoriesSubscription = this._searchAreaService.getCategory(val)
      .subscribe((category) => {
        this.categorySelected = category;
      });
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {
  }
}
