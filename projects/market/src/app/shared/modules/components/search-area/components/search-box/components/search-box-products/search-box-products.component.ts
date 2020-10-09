import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { NotificationsService, SuggestionCategoryItemModel, SuggestionProductItemModel } from '#shared/modules/common-services';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { SearchBoxItemComponent } from '../search-box-item/search-box-item.component';
import { SearchAreaService } from '../../../../search-area.service';
import { debounceTime, filter } from 'rxjs/operators';
import { combineLatest, Subscription } from 'rxjs';
import { SearchResultsTitleEnumModel } from '../../../../models';
import { unsubscribeList } from '#shared/utils';

@Component({
  selector: 'market-search-box-products',
  templateUrl: './search-box-products.component.html',
  styleUrls: ['./search-box-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxProductsComponent implements AfterViewInit, OnDestroy {
  @ViewChildren(SearchBoxItemComponent) private _itemComponents: QueryList<SearchBoxItemComponent>;
  private _keyManager: ActiveDescendantKeyManager<SearchBoxItemComponent>;
  productQueries: SuggestionProductItemModel[];
  categoryQueries: SuggestionCategoryItemModel[];

  private _upDownKeyboardInputCtrlEventSubscription: Subscription;
  private _queriesChangeSubscription: Subscription;

  constructor(
    private _searchAreaService: SearchAreaService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    this._queriesChangeSubscription = combineLatest([this._searchAreaService.productQueries$, this._searchAreaService.categoryQueries$])
      .pipe(debounceTime(this._searchAreaService.debounceTime))
      .subscribe(([productQueries, categoryQueries]) => {
        this.productQueries = productQueries;
        this.categoryQueries = categoryQueries;

        this._searchAreaService.resultsTitle =
          productQueries?.length || categoryQueries?.length ? SearchResultsTitleEnumModel.DEFAULT : SearchResultsTitleEnumModel.EMPTY;

        this._keyManager = new ActiveDescendantKeyManager(this._itemComponents).withWrap();
        this._cdr.detectChanges();
        this._cdr.markForCheck();
      });

    this._upDownKeyboardInputCtrlEventSubscription = this._searchAreaService.upDownKeyboardInputCtrlEvent$
      .pipe(filter((res) => res))
      .subscribe((res) => {
        this._keyManager.onKeydown(res);
      });
  }

  ngOnDestroy() {
    this._keyManager = null;
    this._itemComponents = null;
    unsubscribeList([this._upDownKeyboardInputCtrlEventSubscription, this._queriesChangeSubscription]);
  }

  chooseProduct(product: SuggestionProductItemModel) {
    this._searchAreaService.putSearchProductToBrowser(product);
    this._router.navigate([`./product/${product.id}`]);
  }

  chooseCategory(category: SuggestionCategoryItemModel) {
    this._searchAreaService.putSearchCategoryToBrowser(category);
    this._router.navigate([`./category/${category.id}`]);
  }
}
