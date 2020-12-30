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
import { SearchAreaService } from '../../search-area.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  locationNameConditionValidator,
  priceConditionValidator,
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
import { DOCUMENT } from '@angular/common';

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

  get areAdditionalFiltersEnabled() {
    return this._searchAreaService.areAdditionalFiltersEnabled;
  }

  private _refreshFormSubscription: Subscription;
  private _supplierNameChangeSubscription: Subscription;
  private _priceFromChangeSubscription: Subscription;
  private _priceToChangeSubscription: Subscription;
  private _priceRangeChangeSubscription: Subscription;
  private _locationNameChangeSubscription: Subscription;
  private _initialSupplierNameSubscription: Subscription;
  private _categorySearchQueryChangeSubscription: Subscription;
  private _serviceFormCategoryIdChangeSubscription: Subscription;

  get minPrice(): number {
    return this._filterFormConfig.priceFrom;
  }

  get maxPrice(): number {
    return this._filterFormConfig.priceTo;
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
    if (!this.serviceForm.get('filters')) {
      this._initForm();
      this._refreshForm();
      this._setInitialFormLocation();
      this._setInitialFormSupplier();
      this._attachForm();
    }
    if (this.serviceForm.get('filters')) {
      this.form = this.serviceForm.get('filters') as FormGroup;
    }
    this._handleSupplierNameChanges();
    this._handleLocationNameChanges();
    this._handlePriceChanges();
    this._handleCategorySearchQueryChanges();
  }

  ngAfterViewInit() {
    this._setInitialScrollPosition();
    this._handleServiceFormCategoryIdChanges();
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
    const categoryIndex = this.filteredCategories.findIndex((x) => x.id === this.form.get('subCategoryId').value);
    if (categoryIndex > -1) {
      this._viewPort.scrollToIndex(categoryIndex, 'smooth');
    }
  }

  ngOnDestroy() {
    unsubscribeList([
      this._refreshFormSubscription,
      this._supplierNameChangeSubscription,
      this._priceFromChangeSubscription,
      this._priceToChangeSubscription,
      this._priceRangeChangeSubscription,
      this._locationNameChangeSubscription,
      this._initialSupplierNameSubscription,
      this._categorySearchQueryChangeSubscription,
      this._serviceFormCategoryIdChangeSubscription,
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
    this.serviceForm.get('base.categoryId').patchValue('');
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
        priceFrom: new FormControl(this._filterFormConfig.priceFrom, [priceConditionValidator]),
        priceTo: new FormControl(this._filterFormConfig.priceTo, [priceConditionValidator]),
        priceRange: new FormControl([this._filterFormConfig.priceFrom, this._filterFormConfig.priceTo]),
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

  private _handlePriceChanges(): void {
    this._priceFromChangeSubscription = this.form.get('priceFrom').valueChanges.subscribe((price) => {
      this.form.get('priceFrom').setValue(+price, { onlySelf: true, emitEvent: false });
      this.form.get('priceRange').setValue([+price, this.form.get('priceRange').value[1]], {
        onlySelf: true,
        emitEvent: false,
      });
    });

    this._priceToChangeSubscription = this.form.get('priceTo').valueChanges.subscribe((price) => {
      this.form.get('priceTo').setValue(+price, { onlySelf: true, emitEvent: false });
      this.form.get('priceRange').setValue([this.form.get('priceRange').value[0], +price], {
        onlySelf: true,
        emitEvent: false,
      });
    });

    this._priceRangeChangeSubscription = this.form.get('priceRange').valueChanges.subscribe((prices) => {
      this.form.get('priceFrom').setValue(+prices[0], { onlySelf: true, emitEvent: false });
      this.form.get('priceTo').setValue(+prices[1], { onlySelf: true, emitEvent: false });
      this.form.get('priceRange').setValue([+prices[0], +prices[1]], {
        onlySelf: true,
        emitEvent: false,
      });
    });
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
    const readyToSubmit =
      obj1 !== null
        ? PROPS_AUTO_SUBMIT.some((prop) => {
          return getPropValueByPath(prop, obj1) !== getPropValueByPath(prop, obj2);
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

  selectSupplier(supplier: SuppliersItemModel) {
    this.form.get('supplier.isSelected').patchValue(true);
    this.form.get('supplier.id').patchValue(supplier.id);
    this.suppliersToChoose = null;
  }

  selectSupplierOnEnter() {
    const foundSupplier = this.suppliersToChoose?.find((x) => {
      return x.name.toLowerCase() === this.form.get('supplier.name').value.toLowerCase();
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
    const foundLocation = this.locationsToChoose?.find((x) => {
      return x.name.toLowerCase() === this.form.get('location.name').value.toLowerCase();
    });
    if (foundLocation) {
      this.form.get('location.isSelected').patchValue(true);
      this.form.get('location.fias').patchValue(foundLocation.fias);
      this._searchAreaService.putUserLocation(foundLocation);
    }
  }

  private _updateModifiedFiltersCounter() {
    let counter = 0;
    const formPropertiesList = ['trademark', 'isDelivery', 'isPickup', 'inStock', 'withImages', 'hasDiscount', 'priceFrom', 'priceTo', 'subCategoryId'];
    if (this._searchAreaService.markerIsSupplierControlVisible === true) {
      formPropertiesList.push('supplier.id');
    }
    formPropertiesList.forEach((item) => {
      if (this.form.get(item).value !== getPropValueByPath(item, this._filterFormConfig)) {
        counter++;
      }
    });
    this._searchAreaService.modifiedFiltersCounter$.next(counter);
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
}
