import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SearchAreaService } from '#shared/modules/components/search-area/search-area.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
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

const PAGE_SIZE = 20;
const SCREEN_WIDTH_BREAKPOINT = 992;
const PROPS_AUTO_SUBMIT = [
  'supplier.id',
  'trademark',
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

@Component({
  selector: 'market-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss', './search-filter.component-992.scss'],
})
export class SearchFilterComponent implements OnInit, OnDestroy, AfterViewInit {
  componentId = Math.random();
  @ViewChild(CdkVirtualScrollViewport) private _viewPort: CdkVirtualScrollViewport;
  locationsToChoose: LocationModel[] = Megacity.ALL;
  suppliersToChoose: SuppliersItemModel[] = null;
  @Output() formInitialized: EventEmitter<[FormGroup, string]> = new EventEmitter<any>();
  form: FormGroup;
  availableCategories$: BehaviorSubject<CategoryModel[]> = new BehaviorSubject(null);
  filteredCategories: CategoryModel[] = null;

  get features(): FormArray {
    return this.form?.controls?.features as FormArray;
  }

  get featuresData(): FormArray {
    return this.form?.controls?.featuresData as FormArray;
  }

  get areAdditionalFiltersEnabled() {
    return this._searchAreaService.areAdditionalFiltersEnabled;
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

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(FILTER_FORM_CONFIG) private _filterFormConfig: FilterFormConfigModel,
    private _searchAreaService: SearchAreaService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _notificationsService: NotificationsService,
  ) {
  }

  resetControl(controlName: string) {
    this.form.get(controlName).patchValue(this._filterFormConfig[controlName]);
  }

  ngOnInit() {
    this._setAvailableCategories();

    if (this.serviceForm.get('filters')) {
      this.form = this.serviceForm.get('filters') as FormGroup;
    } else {
      this._initForm();
      this._refreshForm();
      this._setInitialFormLocation();
      this._setInitialFormSupplier();
      this._attachForm();
    }

    this._handleSupplierNameChanges();
    this._handleLocationNameChanges();
    this._handleCategorySearchQueryChanges();
    this._handleFeaturesDataChanges();
    this._handleNewSummaryFeaturesDataChange();
  }

  ngAfterViewInit() {
    this._setInitialScrollPosition();
    this._handleServiceFormCategoryIdChanges();
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
    this._submit();
    if (this._searchAreaService.screenWidthLessThan(SCREEN_WIDTH_BREAKPOINT)) {
      this.close();
    }
  }

  reset(): void {
    this.form.patchValue({
      trademark: this._filterFormConfig.trademark,
      isPickup: this._filterFormConfig.isPickup,
      isDelivery: this._filterFormConfig.isDelivery,
      inStock: this._filterFormConfig.inStock,
      withImages: this._filterFormConfig.withImages,
      hasDiscount: this._filterFormConfig.hasDiscount,
      priceFrom: this._filterFormConfig.priceFrom,
      priceTo: this._filterFormConfig.priceTo,
      location: this._filterFormConfig.location,
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
        trademark: this._filterFormConfig.trademark,
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
    this._serviceFormCategoryIdChangeSubscription = this.serviceForm
      .get('base.categoryId')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((res) => {
        this.form.get('subCategoryId').patchValue('');
        this.serviceForm.get('base.categoryId').patchValue(res, { emitEvent: false, onlySelf: true });
        this._scrollToCategory();
        this._updateModifiedFiltersCounter();
        this._submit();
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
        () => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
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
          this.form.get('location.isSelected').patchValue(false, { emitEvent: false, onlySelf: true });
          this.form.get('location.fias').patchValue('', { emitEvent: false, onlySelf: true });
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
        () => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
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

          if (val.type === FeatureType.DATE) {
            // todo дописать логику когда появится
          }

          if (val.type === FeatureType.STRING) {
            // todo дописать логику когда появится
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
      .subscribe(
        (org) => {
          this.form.get('supplier.isSelected').patchValue(true, { emitEvent: false, onlySelf: false });
          this.form.get('supplier.name').patchValue(org?.name || '', { emitEvent: false, onlySelf: false });
        },
        () => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private _submit(): void {
    this._searchAreaService.submitChanges$.next(true);
  }

  private _submitIfNeeded([obj1, obj2]: [any, any]): void {
    const readyToSubmit = obj1 !== null
      ? PROPS_AUTO_SUBMIT.some((prop) => {

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
      : true;
    if (readyToSubmit && this.form.valid) {
      this._submit();
    }
  }

  private _setAvailableCategories() {
    const categoryId = this.serviceForm.get('base.categoryId').value || null;
    this._searchAreaService.getSubCategories(categoryId).subscribe(
      (res) => {
        this.filteredCategories = res;
        this.availableCategories$.next([...res]);
      },
      () => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  private _updateModifiedFiltersCounter() {
    let counter = 0;
    const formPropertiesList = ['trademark', 'isDelivery', 'isPickup', 'inStock', 'withImages', 'hasDiscount', 'features', 'priceFrom', 'priceTo', 'subCategoryId'];
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

    values?.sort(this.compareByFeatureType())
      .filter((val) => val.booleanValues || val.enumValues || val.numberValues)
      .forEach((val) => {

        if (val.booleanValues) {
          this.featuresData?.push(this._fb.group({
            featureId: val.featureId,
            featureName: val.featureName,
            type: FeatureType.BOOLEAN,
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

  private compareByFeatureType() {
    return (one, two) => {
      if (one.booleanValues && two.booleanValues || one.enumValues && two.enumValues || one.numberValues && two.numberValues) {
        return 0;
      }
      if ((one.booleanValues && (two.enumValues || two.numberValues)) || (one.enumValues && two.numberValues)) {
        return -1;
      }
      return 1;
    };
  }
}
