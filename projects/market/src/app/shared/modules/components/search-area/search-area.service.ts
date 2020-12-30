import { Inject, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { LocalStorageService } from '#shared/modules/common-services/local-storage.service';
import { BNetService } from '#shared/modules/common-services/bnet.service';
import { UserService } from '#shared/modules/common-services/user.service';
import { NavigationService } from '#shared/modules/common-services/navigation.service';
import {
  CategoryModel,
  Level,
  LocationModel,
  OrganizationResponseModel,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
  SuppliersItemModel,
} from '#shared/modules/common-services/models';
import { SearchItemHistoryModel } from './models/search-item-history.model';
import { BehaviorSubject, defer, Observable, of, Subject } from 'rxjs';
import { CategoryItemModel, SearchResultsTitleEnumModel } from './models';
import { map, switchMap, tap } from 'rxjs/operators';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { OverlayService } from '#shared/modules/common-services/overlay.service';
import { APP_CONFIG, AppConfigModel } from '../../../../config';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService } from '#shared/modules/common-services/category.service';
import { deepTreeSearch, getFlatObjectArray } from '#shared/utils';

const CATEGORY_OTHER = '6341';

@Injectable()
export class SearchAreaService {
  markerIsSupplierControlVisible = true;
  suggestionsEnabled = false;
  suggestionsType: 'history' | 'products' = null;
  resultsTitle: SearchResultsTitleEnumModel = null;
  areCategoriesShown = true;
  filterCollapsed = false;
  mobileFilterShowed = false;
  panelSearchFilterName = 'panel_search-filter';
  submitChanges$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  form: FormGroup;

  version = Math.random();
  private _overlayRef: OverlayRef = null;
  private _overlayConfig: OverlayConfig = new OverlayConfig({
    scrollStrategy: this._overlay.scrollStrategies.block(),
  });
  areSuggestionsEnabled = false;
  suggestionsSpinnerShown$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  historicalQueries$: BehaviorSubject<SearchItemHistoryModel[]> = new BehaviorSubject([]);
  productQueries$: BehaviorSubject<SuggestionProductItemModel[]> = new BehaviorSubject([]);
  categoryQueries$: BehaviorSubject<SuggestionCategoryItemModel[]> = new BehaviorSubject([]);

  activeResultsItemChange$: Subject<{ text: string; type: string }> = new Subject();
  upDownKeyboardInputCtrlEvent$: Subject<any> = new Subject();

  modifiedFiltersCounter$: BehaviorSubject<number> = new BehaviorSubject(null);
  focusChange$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  keyUpChange$: BehaviorSubject<KeyboardEvent> = new BehaviorSubject(null);
  isActiveResultsItemTypeHistorical = false;

  categorySelectedItem$: BehaviorSubject<CategoryItemModel> = new BehaviorSubject(null);

  areAdditionalFiltersEnabled = true;

  get debounceTime(): number {
    return this._appConfig.debounceTime;
  }

  get retryDelay(): number {
    return this._appConfig.retryDelay;
  }

  get categories$(): BehaviorSubject<CategoryModel[]> {
    return this._userService.categories$;
  }

  constructor(
    private _localStorageService: LocalStorageService,
    private _bnetService: BNetService,
    private _categoryService: CategoryService,
    private _userService: UserService,
    private _overlay: Overlay,
    private _overlayService: OverlayService,
    private _navService: NavigationService,
    private _fb: FormBuilder,
    @Inject(APP_CONFIG) private _appConfig: AppConfigModel,
  ) {
    this._initForm();
  }

  private _initForm() {
    this.form = this._fb.group({});
  }

  openOverlay(componentClass: any, cfg: OverlayConfig | null, vcr: ViewContainerRef | null, injector: Injector | null) {
    const config = cfg ? cfg : this._overlayConfig;
    this._overlayRef = this._overlay.create(config);
    let overlayPortal = null;
    if (vcr) {
      overlayPortal = new ComponentPortal(componentClass, vcr, injector);
    }
    if (!vcr) {
      overlayPortal = new ComponentPortal(componentClass, null, injector);
    }
    const compRef = this._overlayRef.attach(overlayPortal);
    this._overlayService.setOverlayRef(this._overlayRef);
    return compRef.instance;
  }

  closeOverlay(panelClass?: string) {
    this._overlayService.resetOverlayRef(panelClass);
  }

  isOverlayAttached(): boolean {
    return this._overlayService.isOverlayAttached();
  }

  updateQueries(query: string): Observable<any> {
    return this._bnetService.searchSuggestions(query).pipe(
      tap(({ products, categories }) => {
        this.productQueries$.next(products);
        this.categoryQueries$.next(categories);
      }),
    );
  }

  enableSuggestions(val: boolean): void {
    this.areSuggestionsEnabled = val;
  }

  showSpinner(): void {
    this.suggestionsSpinnerShown$.next(true);
  }

  hideSpinner(): void {
    this.suggestionsSpinnerShown$.next(false);
  }

  screenWidthGreaterThan(val: number): boolean {
    return this._navService.screenWidthGreaterThan(val);
  }

  screenWidthLessThan(val: number): boolean {
    return this._navService.screenWidthLessThan(val);
  }

  updateHistoricalQueries(): void {
    if (this._hasSearchHistoryInBrowser()) {
      const data = this._localStorageService.getSearchQueriesHistoryListNEW();
      this.historicalQueries$.next(data);
    }
  }

  private _hasSearchHistoryInBrowser(): boolean {
    return this._localStorageService.hasSearchQueriesHistory();
  }

  putSearchQueryToBrowser(searchQuery: SearchItemHistoryModel): void {
    this._localStorageService.putSearchQuery(searchQuery);
  }

  removeSearchQueryFromBrowser(id: string): void {
    return this._localStorageService.removeSearchQuery(id);
  }

  putSearchProductToBrowser(product: SuggestionProductItemModel): void {
    this._localStorageService.putSearchProduct(product);
  }

  putSearchCategoryToBrowser(category: SuggestionCategoryItemModel): void {
    this._localStorageService.putSearchCategory(category);
  }

  searchSuppliers(query: string, _page: number, _size: number): Observable<SuppliersItemModel[]> {
    return this._bnetService.searchSuppliers({
      q: query,
      page: _page,
      size: _size
    }).pipe(map((res) => res._embedded.suppliers));
  }

  getOrganizationById(id: string): Observable<OrganizationResponseModel> {
    return this._bnetService.getOrganization(id);
  }

  searchLocations(query: string): Observable<LocationModel[]> {
    return this._bnetService.searchLocations(query, Level.CITY);
  }

  hasUserLocation(): boolean {
    return this._localStorageService.hasUserLocation();
  }

  getUserLocation(): LocationModel {
    return this._localStorageService.getUserLocation();
  }

  putUserLocation(location: LocationModel): void {
    return this._localStorageService.putUserLocation(location);
  }

  removeUserLocation(): void {
    return this._localStorageService.removeUserLocation();
  }

  getSubCategories(categoryId: string = null): Observable<CategoryModel[]> {
    return this._bnetService.getCategories().pipe(
      switchMap((res) => {
        return defer(() => {
          return !categoryId ? of(res.categories) : this._getFlatChildrenCategories(categoryId);
        });
      }),
    );
  }

  private _getFlatChildrenCategories(categoryId: string): Observable<CategoryModel[]> {
    return this.categories$.pipe(
      map((res) => {
        let childrenCategories = [];
        if (categoryId !== CATEGORY_OTHER) {
          const foundCategory = deepTreeSearch(res, 'id', (k, v) => v === categoryId);
          childrenCategories = foundCategory?.children;
        }
        return getFlatObjectArray(childrenCategories);
      }),
    );
  }
}
