import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild, } from '@angular/core';
import { SearchAreaService } from '#shared/modules/components/search-area/search-area.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  dateFeatureRangeConditionValidator,
  locationNameConditionValidator,
  numFeatureRangeConditionValidator,
  priceRangeConditionValidator,
  supplierNameConditionValidator,
} from './search-filter-conditions.validator';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { getPropValueByPath, unsubscribeList } from '#shared/utils';
import {
  catchError,
  debounceTime,
  delay,
  distinctUntilChanged,
  expand,
  filter,
  pairwise,
  startWith,
  switchMap,
  take,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { CategoryModel, LocationModel, Megacity, SuppliersItemModel } from '#shared/modules/common-services/models';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NotificationsService } from '#shared/modules/common-services/notifications.service';
import { FILTER_FORM_CONFIG, FilterFormConfigModel } from '../../config';
import { FeatureType } from '../../models';
import { DOCUMENT } from '@angular/common';
import {
  ProductOffersSummaryFeatureEnumValuesModel,
  ProductOffersSummaryFeatureModel
} from '#shared/modules/common-services/models/product-offers-summary.model';
import format from 'date-fns/format';

const PAGE_SIZE = 20;
const SCREEN_WIDTH_BREAKPOINT = 992;
const PROPS_AUTO_SUBMIT = [
  'supplier.id',
  'tradeMark',
  'isDelivery',
  'isPickup',
  'inStock',
  'withImages',
  'hasDiscount',
  'priceFrom',
  'priceTo',
  'features',
  'location.fias',
  'subCategoryId',
];

const DATE_PATTERN = /^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$/

@Component({
  selector: 'market-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss', './search-filter.component-992.scss'],
})
export class SearchFilterComponent implements OnInit, OnDestroy, AfterViewInit {
  currentDate = Date.now();
  componentId = Math.random();
  form: FormGroup;
  filteredCategories: CategoryModel[] = null;
  locationsToChoose: LocationModel[] = Megacity.ALL;
  suppliersToChoose: SuppliersItemModel[] = null;
  isIE = /msie\s|trident\//i.test(window.navigator.userAgent);
  availableCategories$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);

  @ViewChild(CdkVirtualScrollViewport) private _viewPort: CdkVirtualScrollViewport;
  @Output() formInitialized: EventEmitter<[FormGroup, string]> = new EventEmitter<any>();

  get features(): FormArray {
    return this.form?.controls?.features as FormArray;
  }

  get featuresData(): FormArray {
    return this.form?.controls?.featuresData as FormArray;
  }

  get filterCollapsed(): boolean {
    return this._searchAreaService.filterCollapsed;
  }

  get markerIsSupplierControlVisible(): boolean {
    return this._searchAreaService.markerIsSupplierControlVisible;
  }

  get serviceForm(): FormGroup {
    return this._searchAreaService.form;
  }

  get categorySelected(): boolean {
    return !!this.serviceForm.get('base.categoryId')?.value || !!this.form.get('subCategoryId')?.value;
  }

  private _refreshFormSubscription: Subscription;
  private _supplierNameChangeSubscription: Subscription;
  private _priceFromChangeSubscription: Subscription;
  private _priceToChangeSubscription: Subscription;
  private _locationNameChangeSubscription: Subscription;
  private _initialSupplierNameSubscription: Subscription;
  private _categorySearchQueryChangeSubscription: Subscription;
  private _serviceFormCategoryIdChangeSubscription: Subscription;
  private _featuresDataChangeSubscription: Subscription;
  private _newSummaryFeaturesDataChangeSubscription: Subscription;
  private _filterSetChangeSubscription: Subscription;

  get searchType(): 'category' | 'supplier' {
    return this._searchAreaService.searchType;
  }

  constructor(
    private _fb: FormBuilder,
    @Inject(DOCUMENT) private _document: Document,
    private _searchAreaService: SearchAreaService,
    private _notificationsService: NotificationsService,
    @Inject(FILTER_FORM_CONFIG) private _filterFormConfig: FilterFormConfigModel,
  ) {
  }

  resetControl(controlName: string) {
    this.form.get(controlName).patchValue(this._filterFormConfig[controlName]);
  }

  ngOnInit() {
    if (!this.serviceForm.get('filters')) {
      this._initForm();
      this._refreshForm();
      this._setInitialFormLocation();
      this._setInitialFormSupplier();
      this._attachForm();
    } else {
      this.form = this.serviceForm.get('filters') as FormGroup;
    }
    if (this.searchType !== 'supplier') {
      this._handleSupplierNameChanges();
      this._handleFilterSetChange();
    }

    this._setAvailableCategories();
    this._handleLocationNameChanges();
    this._handleCategorySearchQueryChanges();
    this._handleFeaturesDataChanges();
    this._handleNewSummaryFeaturesDataChange();
  }

  ngAfterViewInit() {
    this._setInitialScrollPosition();
    if (this.searchType !== 'supplier') {
      this._handleServiceFormCategoryIdChanges();
    }
  }

  ngOnDestroy() {
    unsubscribeList([
      this._refreshFormSubscription,
      this._supplierNameChangeSubscription,
      this._priceFromChangeSubscription,
      this._priceToChangeSubscription,
      this._locationNameChangeSubscription,
      this._initialSupplierNameSubscription,
      this._categorySearchQueryChangeSubscription,
      this._serviceFormCategoryIdChangeSubscription,
      this._featuresDataChangeSubscription,
      this._newSummaryFeaturesDataChangeSubscription,
      this._filterSetChangeSubscription,
    ]);
  }

  toggleCollapse(): void {
    this._searchAreaService.filterCollapsed = !this._searchAreaService.filterCollapsed;
  }

  close(): void {
    this._searchAreaService.mobileFilterShowed = false;
    this._searchAreaService.closeOverlay(this._searchAreaService.panelSearchFilterName);
  }

  save(): void {
    this._submit('box');
    if (this._searchAreaService.screenWidthLessThan(SCREEN_WIDTH_BREAKPOINT)) {
      this.close();
    }
  }

  reset(): void {
    this.form.patchValue({
      tradeMark: this._filterFormConfig.tradeMark,
      isPickup: this._filterFormConfig.isPickup,
      isDelivery: this._filterFormConfig.isDelivery,
      inStock: this._filterFormConfig.inStock,
      withImages: this._filterFormConfig.withImages,
      priceFrom: this._filterFormConfig.priceFrom,
      priceTo: this._filterFormConfig.priceTo,
      location: this._filterFormConfig.location,
      hasDiscount: this._filterFormConfig.hasDiscount,
      ...(this._searchAreaService.markerIsSupplierControlVisible && {
        supplier: this._filterFormConfig.supplier,
      }),
      subCategoryId: this._filterFormConfig.subCategoryId,
    });

    (this.form.controls.features as FormArray).clear();
    (this.form.controls.featuresData as FormArray).clear();

    this.serviceForm.get('base.categoryId').patchValue('');
  }

  selectSupplier(supplier: SuppliersItemModel) {
    this.form.get('supplier.isSelected').patchValue(true);
    this.form.get('supplier.id').patchValue(supplier.id);
    this.suppliersToChoose = null;
  }

  selectSupplierOnEnter() {
    const foundSupplier = this.suppliersToChoose?.find((supplier) => {
      return supplier.name.toLowerCase() === this.form.get('supplier.name').value.toLowerCase();
    });
    if (foundSupplier) {
      this.form.get('supplier.isSelected').patchValue(true);
      this.form.get('supplier.id').patchValue(foundSupplier.id);
    }
  }

  selectLocation(location: LocationModel) {
    this.form.get('location.isSelected').patchValue(true);
    this.form.get('location.fias').patchValue(location.fias);
    this._searchAreaService.putUserLocation(location);
  }

  selectLocationOnEnter() {
    const foundLocation = this.locationsToChoose?.find((location) => {
      return location.name.toLowerCase() === this.form.get('location.name').value.toLowerCase();
    });
    if (foundLocation) {
      this.form.get('location.isSelected').patchValue(true);
      this.form.get('location.fias').patchValue(foundLocation.fias);
      this._searchAreaService.putUserLocation(foundLocation);
    }
  }

  setCategoryId(target: any) {
    const el: HTMLElement = target.closest('.category_item');
    if (el) {
      const id = el.dataset.id.toString();
      const formValue = this.form.get('subCategoryId').value.toString();
      if (!formValue) {
        this.form.get('subCategoryId').patchValue(el.dataset.id);
      } else if (formValue === id) {
        this.form.get('subCategoryId').patchValue('');
      }
    }
  }

  isFocused(el: HTMLElement): boolean {
    return el === this._document.activeElement;
  }

  private _initForm() {
    this.form = this._fb.group(
      {
        location: this._setLocationFormPart(),
        supplier: this._setSupplierFormPart(),
        tradeMark: this._filterFormConfig.tradeMark,
        isDelivery: this._filterFormConfig.isDelivery,
        isPickup: this._filterFormConfig.isPickup,
        inStock: this._filterFormConfig.inStock,
        withImages: this._filterFormConfig.withImages,
        hasDiscount: this._filterFormConfig.hasDiscount,
        features: this._fb.array(this._filterFormConfig.features),
        featuresData: this._fb.array(this._filterFormConfig.featuresData),
        priceFrom: new FormControl(this._filterFormConfig.priceFrom, [Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)]),
        priceTo: new FormControl(this._filterFormConfig.priceTo, [Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)]),
        categorySearchQuery: this._filterFormConfig.categorySearchQuery,
        subCategoryId: this._filterFormConfig.subCategoryId,
      },
      {
        validator: [priceRangeConditionValidator],
      },
    );
  }

  private _setSupplierFormPart(): FormGroup {
    return this._fb.group(
      {
        id: this._filterFormConfig.supplier.id,
        name: this._filterFormConfig.supplier.name,
        isSelected: this._filterFormConfig.supplier.isSelected,
      },
      {
        validator: [supplierNameConditionValidator],
      },
    );
  }

  private _setInitialScrollPosition(): void {
    const availableCategoriesStream$ = this.availableCategories$.pipe(filter((res) => res && this.form.get('subCategoryId').value)).pipe(
      delay(this._searchAreaService.retryDelay),
      takeWhile((url) => {
        return this._viewPort.measureRenderedContentSize() !== 0;
      }),
    );

    availableCategoriesStream$
      .pipe(
        expand((res) => availableCategoriesStream$),
        take(1),
      )
      .subscribe((res) => {
        this._scrollToCategory();
        this._updateModifiedFiltersCounter();
      });
  }

  private _handleServiceFormCategoryIdChanges(): void {
    let catId = null;
    this._serviceFormCategoryIdChangeSubscription = this.serviceForm
      .get('base.categoryId')
      .valueChanges.pipe(
        distinctUntilChanged(),
        tap((categoryId) => catId = categoryId),
        switchMap((categoryId) => {
          return this._searchAreaService.getSubCategoriesList(categoryId)
        })
      )
      .subscribe((res) => {
        this.filteredCategories = res;
        this.availableCategories$.next([...res]);
        this.form.get('subCategoryId').patchValue('');
        this.serviceForm.get('base.categoryId').patchValue(catId, { emitEvent: false, onlySelf: true });
        this._scrollToCategory();
        this._updateModifiedFiltersCounter();
        this._submit('box');
      }, (err) => {
        this._notificationsService.error(err);
      });
  }

  private _scrollToCategory() {
    const categoryIndex = this.filteredCategories.findIndex((category) => category.id === this.form.get('subCategoryId').value);
    if (categoryIndex > -1) {
      this._viewPort.scrollToIndex(categoryIndex, 'smooth');
    }
  }

  private _setLocationFormPart(): FormGroup {
    return this._fb.group(
      {
        fias: this._filterFormConfig.location.fias,
        name: this._filterFormConfig.location.name,
        isSelected: this._filterFormConfig.location.isSelected,
      },
      {
        validator: [locationNameConditionValidator],
      },
    );
  }

  private _attachForm(): void {
    this.formInitialized.emit([this.form, 'filters']);
  }

  private _refreshForm(): void {
    this._refreshFormSubscription = this.form.valueChanges
      .pipe(debounceTime(this._searchAreaService.debounceTime), startWith(null), pairwise())
      .subscribe((res) => {
        this.form.patchValue(this.form.value, { emitEvent: false, onlySelf: true });
        this._updateModifiedFiltersCounter();
        this._submitIfNeeded(res);
      });
  }

  private _handleSupplierNameChanges(): void {
    this._supplierNameChangeSubscription = this.form
      .get('supplier.name')
      .valueChanges.pipe(
        tap(() => {
          this.form.get('supplier.isSelected').patchValue(false, { emitEvent: false, onlySelf: true });
          this.form.get('supplier.id').patchValue('', { emitEvent: false, onlySelf: true });
        }),
        switchMap((supplierName) => {
          return supplierName.trim().length <= 2
            ? of(null)
            : this._searchAreaService.searchSuppliers(supplierName, 0, PAGE_SIZE).pipe(
              catchError((err) => {
                return of(null);
              }),
            );
        }),
      )
      .subscribe(
        (data) => {
          this.suppliersToChoose = data;
        },
        (err) => {
          this._notificationsService.error(err);
        },
      );
  }

  private _handleLocationNameChanges(): void {
    this._locationNameChangeSubscription = this.form
      .get('location.name')
      .valueChanges.pipe(
        tap((locationName) => {
          if (locationName === '') {
            this._searchAreaService.removeUserLocation();
          }
        }),
        switchMap((locationName) => {
          const foundMegaCity = Megacity.ALL.find((x) => {
            return x.name.toLowerCase() === locationName.toLowerCase();
          });

          return foundMegaCity || locationName.trim().length <= 1
            ? of(Megacity.ALL)
            : this._searchAreaService.searchLocations(locationName).pipe(
              catchError((err) => {
                return of(null);
              }),
            );
        }),
      )
      .subscribe(
        (data) => {
          this.locationsToChoose = data;
        },
        (err) => {
          this._notificationsService.error(err);
        },
      );
  }

  private _handleCategorySearchQueryChanges(): void {
    this._categorySearchQueryChangeSubscription = this.form
      .get('categorySearchQuery')
      .valueChanges.pipe(distinctUntilChanged(), debounceTime(this._searchAreaService.debounceTime))
      .subscribe((query) => {
        this.filteredCategories =
          this.availableCategories$?.getValue()?.filter((category) => {
            return category?.name.toLowerCase().includes(query.toLowerCase());
          }) || null;
      });
  }

  private _handleFeaturesDataChanges() {
    this._featuresDataChangeSubscription = this.form.controls.featuresData
      .valueChanges
      .subscribe((value: any[]) => {

        this.features.clear();

        value.forEach((val) => {
          if (val.type === FeatureType.BOOLEAN && val.boolValue !== null) {
            this.features.push(this._fb.control(`${val.featureId}:${val.boolValue}`));
          }

          if (val.type === FeatureType.ENUMERATION && val.enumValues.some((x) => x.enumValue)) {
            this.features.push(this._fb.control(`${val.featureId}:[${val.enumValues.filter((f) => f.enumValue).map((f) => f.valueId).join('|')}]`));
          }

          if (val.type === FeatureType.NUMBER && (val.numValueFrom || val.numValueTo)) {
            if (val.numValueFrom && val.numValueTo) {

              this.features.push(this._fb.control(`${val.featureId}:${val.numValueFrom}~${val.numValueTo}`));
            } else if (!val.numValueFrom) {

              this.features.push(this._fb.control(`${val.featureId}:~${val.numValueTo}`));
            } else {

              this.features.push(this._fb.control(`${val.featureId}:${val.numValueFrom}~`));
            }
          }

          if (val.type === FeatureType.DATE && (val.dateValueFrom || val.dateValueTo)) {
            if (val.dateValueFrom && val.dateValueTo) {

              this.features.push(this._fb.control(`${val.featureId}:${format(new Date(val.dateValueFrom), 'yyyy-MM-dd')}~${format(new Date(val.dateValueTo), 'yyyy-MM-dd')}`));
            } else if (!val.dateValueFrom) {

              this.features.push(this._fb.control(`${val.featureId}:~${format(new Date(val.dateValueTo), 'yyyy-MM-dd')}`));
            } else {

              this.features.push(this._fb.control(`${val.featureId}:${format(new Date(val.dateValueFrom), 'yyyy-MM-dd')}~`));
            }
          }
        });
      });
  }

  private _handleNewSummaryFeaturesDataChange() {
    this._newSummaryFeaturesDataChangeSubscription = this._searchAreaService.summaryFeaturesData$
      .subscribe((data) => {
        this.initFeaturesData(data?.values, data?.featuresQueries);
      });
  }

  private _handleFilterSetChange() {
    this._filterSetChangeSubscription = this._searchAreaService.filterSetChanges$
      .subscribe((isAvailable) => {
        if (isAvailable) {
          this.form.get('isDelivery').enable();
          this.form.get('isPickup').enable();
          this.form.get('inStock').enable();
          this.form.get('withImages').enable();
          this.form.get('hasDiscount').enable();
          this.form.get('priceFrom').enable();
          this.form.get('priceTo').enable();
        } else {
          this.form.get('isDelivery').disable();
          this.form.get('isPickup').disable();
          this.form.get('inStock').disable();
          this.form.get('withImages').disable();
          this.form.get('hasDiscount').disable();
          this.form.get('priceFrom').disable();
          this.form.get('priceTo').disable();
        }
      });
  }

  private _setInitialFormLocation(): void {
    if (this._searchAreaService.hasUserLocation()) {
      const userLocation = this._searchAreaService.getUserLocation();

      if (userLocation) {
        this.form.get('location.isSelected').patchValue(true, { emitEvent: false, onlySelf: false });
        this.form.get('location.name').patchValue(userLocation?.name || '', { emitEvent: false, onlySelf: false });
        this.form.get('location.fias').patchValue(userLocation?.fias || '', { emitEvent: false, onlySelf: false });
      }
    }
  }

  private _setInitialFormSupplier(): void {
    this._initialSupplierNameSubscription = this.form
      .get('supplier.id')
      .valueChanges.pipe(
        filter((res) => !!res),
        take(1),
        switchMap((id) => {
          return this._searchAreaService.getOrganizationById(id);
        }),
      )
      .subscribe((org) => {
          this.form.get('supplier.isSelected').patchValue(true, { emitEvent: false, onlySelf: false });
          this.form.get('supplier.name').patchValue(org?.name || '', { emitEvent: false, onlySelf: false });
        },
        (err) => {
          this._notificationsService.error(err);
        },
      );
  }

  private _submit(type: 'box' | 'filters'): void {
    this._searchAreaService.submitBoxChanges$.next(type);
  }

  private _submitIfNeeded([obj1, obj2]: [any, any]): void {
    if (obj1 === null) {
      return;
    }

    const readyToSubmit = PROPS_AUTO_SUBMIT.some((prop) => {

      const oldObj = getPropValueByPath(prop, obj1);
      const newObj = getPropValueByPath(prop, obj2);

      if (Array.isArray(newObj)) {
        if (oldObj.length === 0 && newObj.length === 0) {
          return false;
        }
        return oldObj.length !== newObj.length || newObj.some((value) => !oldObj.includes(value));
      }

      return oldObj !== newObj;
    })

    if (readyToSubmit && this.form.valid) {
      this._submit('filters');
    }
  }

  private _setAvailableCategories() {
    if (this.searchType === 'category') {
      const categoryId = this.serviceForm.get('base.categoryId')?.value || null;
      this._searchAreaService.getSubCategoriesList(categoryId).subscribe(
        (categories) => {
          this.filteredCategories = categories;
          if (categories) {
            this.availableCategories$.next([...categories]);
          }
        },
        (err) => {
          this._notificationsService.error(err);
        },
      );
    }

    if (this.searchType === 'supplier') {
      const supplierId = this.serviceForm.get('filters.supplier.id')?.value || null;
      if (supplierId) {
        this._searchAreaService.getSupplierCategoriesList(supplierId).subscribe(
          (res) => {
            this.filteredCategories = res;
            this.availableCategories$.next([...res]);
          },
          (err) => {
            this._notificationsService.error(err);
          },
        )
      }
    }
  }

  private _updateModifiedFiltersCounter() {
    let counter = 0;
    const formPropertiesList = ['tradeMark', 'isDelivery', 'isPickup', 'inStock', 'withImages', 'hasDiscount', 'features', 'priceFrom', 'priceTo', 'subCategoryId'];
    if (this._searchAreaService.markerIsSupplierControlVisible === true) {
      formPropertiesList.push('supplier.id');
    }
    formPropertiesList.forEach((item) => {
      if (Array.isArray(this.form.get(item).value)) {
        counter += this.form.get(item).value.length;
      }

      if (!Array.isArray(this.form.get(item).value) && this.form.get(item).value !== getPropValueByPath(item, this._filterFormConfig)) {
        counter++;
      }
    });
    this._searchAreaService.modifiedFiltersCounter$.next(counter);
  }

  private initFeaturesData(values: ProductOffersSummaryFeatureModel[], featuresQueries: string[]) {
    this.featuresData.clear();

    values?.sort(this.compareByFeatureType())
      .filter((val) => val.booleanValues || val.enumValues || val.numberValues || val.dateValues)
      .forEach((val) => {

        if (val.booleanValues) {
          this.featuresData?.push(this._fb.group({
            featureId: val.featureId,
            featureName: val.featureName,
            type: FeatureType.BOOLEAN,
            values: this._fb.array(val.booleanValues.map((v) => this._fb.control(v))),
            boolValue: this.boolValueIfHas(val, featuresQueries),
          }));
        }

        if (val.enumValues) {
          this.featuresData?.push(this._fb.group({
            featureId: val.featureId,
            featureName: val.featureName,
            type: FeatureType.ENUMERATION,
            enumValues: this._fb.array(this.groupEnumValuesFrom(val, featuresQueries)),
          }));
        }

        if (val.numberValues) {
          this.featuresData?.push(this._fb.group({
            featureId: val.featureId,
            featureName: val.featureName,
            type: FeatureType.NUMBER,
            min: val.numberValues?.min,
            max: val.numberValues?.max,
            numValueFrom: this._fb.control(this.numValueIfHas(val, featuresQueries, true),
              [Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)]),
            numValueTo: this._fb.control(this.numValueIfHas(val, featuresQueries, false),
              [Validators.min(0), Validators.max(Number.MAX_SAFE_INTEGER)]),
          }, {
            validator: [numFeatureRangeConditionValidator],
          }));
        }

        if (val.dateValues) {
          this.featuresData?.push(this._fb.group({
            featureId: val.featureId,
            featureName: val.featureName,
            type: FeatureType.DATE,
            min: val.dateValues?.min,
            max: val.dateValues?.max,
            dateValueFrom: this._fb.control(this.dateValueIfHas(val, featuresQueries, true)),
            dateValueTo: this._fb.control(this.dateValueIfHas(val, featuresQueries, false)),
          }, {
            validator: [dateFeatureRangeConditionValidator],
          }))
        }
      });
  }

  private groupEnumValuesFrom(value: ProductOffersSummaryFeatureModel, featuresQueries: string[]): FormGroup[] {
    return value?.enumValues.map((val, index) => {
      return this._fb.group({
        valueId: val.valueId,
        valueName: val.valueName,
        enumValue: this.enumValueIfHas(value, val, featuresQueries) ? true : null,
      })
    });
  }

  private enumValueIfHas(feature: ProductOffersSummaryFeatureModel,
                         enumFeature: ProductOffersSummaryFeatureEnumValuesModel, queries: string[]): boolean {
    return queries?.some((x) => x.includes(enumFeature.valueId) && x.includes(feature.featureId));
  }

  private boolValueIfHas(feature: ProductOffersSummaryFeatureModel, queries: string[]): boolean {
    const find = queries?.find((x) => x.includes(feature.featureId));
    const value = find?.substr(find.indexOf(':') + 1);
    return value?.length ? 'true' === value : null;
  }

  private numValueIfHas(feature: ProductOffersSummaryFeatureModel, queries: string[], isFrom: boolean) {
    const find = queries?.find((x) => x.includes(feature.featureId));
    const value = find?.substr(isFrom ? find.indexOf(':') + 1 : find.indexOf('~') + 1,
      isFrom ? (find.indexOf('~') - find.indexOf(':') - 1) : undefined);
    return value?.length && Number.isInteger(+value) ? +value : null;
  }

  private dateValueIfHas(feature: ProductOffersSummaryFeatureModel, queries: string[], isFrom: boolean) {
    const find = queries?.find((x) => x.includes(feature.featureId));
    const value = find?.substr(isFrom ? find.indexOf(':') + 1 : find.indexOf('~') + 1,
      isFrom ? (find.indexOf('~') - find.indexOf(':') - 1) : undefined);
    return value?.length && DATE_PATTERN.test(value) ? value : null;
  }

  private compareByFeatureType() {
    return (one, two) => {
      if (one.booleanValues && two.booleanValues || one.enumValues && two.enumValues
        || one.numberValues && two.numberValues || one.dateValues && two.dateValues) {
        return 0;
      }
      if ((one.booleanValues && (two.enumValues || two.numberValues || two.dateValues)) ||
        (one.enumValues && (two.numberValues || two.dateValues)) || (one.numberValues && two.dateValues)) {
        return -1;
      }
      return 1;
    };
  }
}
