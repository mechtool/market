import { Inject, Injectable, Injector, ViewContainerRef } from '@angular/core';
import {
  CategoryService,
  LocalStorageService,
  LocationService,
  NavigationService,
  OrganizationsService,
  OverlayService,
  SuggestionService,
  SupplierService,
  UserService,
} from '#shared/modules/common-services';
import {
  CategoryModel,
  Level,
  LocationModel,
  OrganizationResponseModel,
  ProductOffersSummaryFeatureModel,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
  SuppliersItemModel,
} from '#shared/modules/common-services/models';
import { SearchItemHistoryModel } from './models/search-item-history.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CategoryItemModel, SearchResultsTitleEnumModel } from './models';
import { map, take, tap } from 'rxjs/operators';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { APP_CONFIG, AppConfigModel } from '../../../../config';
import { FormBuilder, FormGroup } from '@angular/forms';


@Injectable()
export class SearchAreaService {
  searchType: 'category' | 'supplier' = 'category';
  markerIsSupplierControlVisible = true;
  suggestionsEnabled = false;
  suggestionsType: 'history' | 'products' = null;
  resultsTitle: SearchResultsTitleEnumModel = null;
  areCategoriesShown = true;
  filterCollapsed = false;
  mobileFilterShowed = false;
  panelSearchFilterName = 'panel_search-filter';
  submitBoxChanges$: BehaviorSubject<'box' | 'filters'> = new BehaviorSubject(null);
  filterSetChanges$: BehaviorSubject<boolean> = new BehaviorSubject(null);
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

  summaryFeaturesData$: BehaviorSubject<{
    hasProducts: boolean,
    featuresQueries: string[],
    values: ProductOffersSummaryFeatureModel[]
  }> = new BehaviorSubject(null);

  activeResultsItemChange$: Subject<{ text: string; type: string }> = new Subject();
  upDownKeyboardInputCtrlEvent$: Subject<any> = new Subject();

  modifiedFiltersCounter$: BehaviorSubject<number> = new BehaviorSubject(null);
  focusChange$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  keyUpChange$: BehaviorSubject<KeyboardEvent> = new BehaviorSubject(null);
  isActiveResultsItemTypeHistorical = false;

  categorySelectedItem$: BehaviorSubject<CategoryItemModel> = new BehaviorSubject(null);

  get debounceTime(): number {
    return this._appConfig.debounceTime;
  }

  get retryDelay(): number {
    return this._appConfig.retryDelay;
  }

  get categoriesTree(): Observable<CategoryModel[]> {
    return this._categoryService.getCategoriesTree();
  }

  getCategory(categoryId: string): Observable<CategoryModel> {
    return this._categoryService.getCategory(categoryId);
  }

  constructor(
    private _fb: FormBuilder,
    private _overlay: Overlay,
    private _userService: UserService,
    private _navService: NavigationService,
    private _overlayService: OverlayService,
    private _categoryService: CategoryService,
    private _locationService: LocationService,
    private _supplierService: SupplierService,
    private _suggestionService: SuggestionService,
    private _localStorageService: LocalStorageService,
    private _organizationsService: OrganizationsService,
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
    return this._suggestionService.searchSuggestions(query).pipe(
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

  newSummaryFeaturesData$(data: { hasProducts: boolean, featuresQueries: string[], values: ProductOffersSummaryFeatureModel[] }): void {
    if (data) {
      if (data.hasProducts) {
        window['oldStateDynamicSearchFilters'] = data.values;
      } else {
        data.values = window['oldStateDynamicSearchFilters'];
      }

      this.summaryFeaturesData$.next(data);
    }
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

  searchSuppliers(query: string, page: number, size: number): Observable<SuppliersItemModel[]> {
    return this._supplierService.findSuppliers(query, page, size)
      .pipe(map((res) => res._embedded.suppliers));
  }

  getOrganizationById(id: string): Observable<OrganizationResponseModel> {
    return this._organizationsService.getOrganization(id);
  }

  searchLocations(query: string): Observable<LocationModel[]> {
    return this._locationService.searchLocations(query, Level.CITY);
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

  getSubCategoriesList(categoryId: string = null): Observable<CategoryModel[]> {
    if (categoryId) {
      return this._categoryService.getChildrenListOfCategory(categoryId);
    }
    return this._categoryService.getCategoriesList();
  }

  getSupplierCategoriesList(supplierId: string): Observable<CategoryModel[]> {
    return this._categoryService.getSupplierCategoriesList({ suppliers: [supplierId] });
  }

  changeCategorySelectedItem(categoryId: string) {
    this._categoryService.getCategory(categoryId)
      .pipe(
        take(1)
      )
      .subscribe((category) => {
        this.categorySelectedItem$.next(category);
      })
  }

  private _hasSearchHistoryInBrowser(): boolean {
    return this._localStorageService.hasSearchQueriesHistory();
  }
}
