import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  CategoryModel,
  DefaultSearchAvailableModel,
  Level,
  LocationModel,
  Megacity,
  SuppliersItemModel,
} from '#shared/modules/common-services/models';
import { ActivatedRoute } from '@angular/router';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { combineLatest, of, throwError } from 'rxjs';
import { resizeBusinessStructure } from '#shared/utils';
import {
  priceConditionValidator,
  priceRangeConditionValidator,
  supplierNameConditionValidator,
} from './search-bar-filter-conditions.validator';
import {
  CategoryService,
  LocalStorageService,
  LocationService,
  NavigationService,
  NotificationsService,
  OrganizationsService,
  SpinnerService,
  SupplierService,
} from '#shared/modules/common-services';

const PAGE_SIZE = 20;

@Component({
  selector: 'market-search-bar-filter',
  templateUrl: './search-bar-filter.component.html',
  styleUrls: [
    './search-bar-filter.component.scss',
    './search-bar-filter.component-768.scss',
    './search-bar-filter.component-575.scss',
    './search-bar-filter.component-400.scss',
    './search-bar-filter.component-360.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarFilterComponent implements OnInit {
  @ViewChild('categoriesDesktopContainer', { read: ViewContainerRef }) private _desktopContainer: ViewContainerRef;
  @ViewChild('categoryDesktopItem', { read: TemplateRef }) private _categoryDesktopItemTemplate: TemplateRef<any>;
  @ViewChild('categoriesMobileContainer', { read: ViewContainerRef }) private _mobileContainer: ViewContainerRef;
  @ViewChild('categoryMobileItem', { read: TemplateRef }) private _categoryMobileItemTemplate: TemplateRef<any>;
  MIN_PRICE = 0;
  MAX_PRICE = 1000000;
  filtersForm: FormGroup;
  categoryForm: FormGroup;
  locationForm: FormGroup;
  categoryId: string;
  categoryIndex: number;
  categories: CategoryModel[];
  showFilterWithCities = false;
  showFilterWithCategories = false;
  notShowFilter = false;
  foundCities: LocationModel[] = [];
  suppliers: SuppliersItemModel[];
  showSupplierMarker = true;
  showCategoryMarker = true;
  private supplier: any;
  private megacities = Megacity.ALL;
  @Input() filters: DefaultSearchAvailableModel;
  @Input() city: string;
  @Input() activeFilters = new Set<string>();
  @Output() stateFilters: EventEmitter<DefaultSearchAvailableModel> = new EventEmitter();
  @Output() stateLocation: EventEmitter<LocationModel> = new EventEmitter();
  @Output() closeFilter: EventEmitter<boolean> = new EventEmitter();
  @Output() stateLocationForm: EventEmitter<LocationModel> = new EventEmitter();
  @Output() filtersCount: EventEmitter<Set<string>> = new EventEmitter();

  get isNotValidForm(): boolean {
    return this.filtersForm?.invalid;
  }

  get focusIsNotFormFilterInn(): boolean {
    return document.activeElement.attributes['formcontrolname']?.value !== 'name';
  }

  get focusIsNotFormFilterPrice(): boolean {
    return (
      document.activeElement.attributes['formcontrolname']?.value !== 'priceFrom' &&
      document.activeElement.attributes['formcontrolname']?.value !== 'priceTo'
    );
  }

  get inStock() {
    return this.filtersForm?.controls.inStock.value;
  }

  get withImages() {
    return this.filtersForm?.controls.withImages.value;
  }

  constructor(
    private _locationService: LocationService,
    private _localStorageService: LocalStorageService,
    private _categoryService: CategoryService,
    private _activatedRoute: ActivatedRoute,
    private _supplierService: SupplierService,
    private _organizationsService: OrganizationsService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _notificationsService: NotificationsService,
    private _spinnerService: SpinnerService,
  ) {}

  ngOnInit(): void {
    this._init();
  }

  save() {
    this._saveFilters();
    this.stateFilters.emit(this.filters);
  }

  reset() {
    this.filters = undefined;
    this.categoryId = undefined;
    this.supplier = undefined;
    this.stateFilters.emit(this.filters);
    this.activeFilters.clear();
    this.filtersCount.emit(this.activeFilters);
    this._initForms();
    this._resetCategories();
    this._categoryChangesControl();
  }

  clickFilterChooseCity() {
    this.showFilterWithCities = true;
    this.notShowFilter = true;
  }

  clickFilterChooseCategory() {
    this.showFilterWithCategories = true;
    this.notShowFilter = true;
  }

  backToFilter() {
    this.showFilterWithCities = false;
    this.showFilterWithCategories = false;
    this.notShowFilter = false;
  }

  close() {
    this.closeFilter.emit(false);
  }

  saveLocation() {
    this.showFilterWithCities = false;
    this.notShowFilter = false;
  }

  saveCategory() {
    this._saveFilters();
    this.showFilterWithCategories = false;
    this.notShowFilter = false;
  }

  chooseCity(location: LocationModel) {
    this._localStorageService.putUserLocation(location);
    this.stateLocationForm.emit(location);
    this.backToFilter();
  }

  supplierSelect(supplier: SuppliersItemModel) {
    this.supplier = {
      id: supplier.id,
      name: supplier.name,
      isSelected: true,
    };
    this.filtersForm.controls.supplier.setValue(this.supplier, { onlySelf: true, emitEvent: false });
    this.filtersForm.controls.supplier.setErrors(null, { emitEvent: false });
    this.suppliers = null;
    this._addActiveFilter('supplierId');
  }

  private _init() {
    combineLatest([this._activatedRoute.params, this._activatedRoute.queryParams])
      .pipe(
        switchMap(([params, queryParams]) => {
          this.categoryId = params.categoryId || queryParams.categoryId;
          const supplierId = params.supplierId || queryParams.supplierId;
          return combineLatest([of(params), supplierId ? this._organizationsService.getOrganization(supplierId) : of(null)]);
        }),
        switchMap(([params, organization]) => {
          if (organization) {
            this.supplier = {
              id: organization.id,
              name: resizeBusinessStructure(organization.name),
              isSelected: true,
            };
          }
          if (params.supplierId) {
            this.showSupplierMarker = false;
            return this._categoryService.getAllSupplierCategories({ suppliers: [params.supplierId] });
          }
          if (params.categoryId) {
            this.showCategoryMarker = false;
          }
          return this._categoryService.getAllSupplierCategories();
        }),
        catchError((err) => {
          return throwError(err);
        }),
      )
      .subscribe(
        (categories) => {
          this.categories = categories;
          if (this.categoryId) {
            this.categories.forEach((category, index) => {
              if (category.id !== this.categoryId) {
                category.disabled = true;
              } else {
                this.categoryIndex = index;
              }
              category.visible = true;
            });
          } else {
            this.categories.forEach((res) => {
              res.visible = true;
            });
          }

          this._initForms();
          this._categoryChangesControl();

          this._activeFiltersCount(this.showSupplierMarker, this.showCategoryMarker);
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private _saveFilters() {
    this.filters = new DefaultSearchAvailableModel();

    if (this.supplier) {
      this.filters.supplierId = this.supplier.id;
    }
    const tradeMark = this.filtersForm.controls.tradeMark.value;
    if (tradeMark) {
      this.filters.tradeMark = tradeMark;
    }

    this.filters.isDelivery = this.filtersForm.controls.isDelivery.value;

    this.filters.isPickup = this.filtersForm.controls.isPickup.value;

    if (this.filtersForm.controls.inStock.value) {
      this.filters.inStock = this.filtersForm.controls.inStock.value;
    }

    if (this.filtersForm.controls.withImages.value) {
      this.filters.withImages = this.filtersForm.controls.withImages.value;
    }

    const priceFrom = this.filtersForm.controls.priceFrom.value;
    if (priceFrom) {
      this.filters.priceFrom = priceFrom;
    }

    const priceTo = this.filtersForm.controls.priceTo.value;
    if (priceTo) {
      this.filters.priceTo = priceTo;
    }

    if (this.categoryId) {
      this.filters.categoryId = this.categoryId;
    }
  }

  private _initForms() {
    this._initFilterForm();
    this._initCategoryForm();
    this._initLocationForm();
  }

  private _initLocationForm() {
    this.foundCities = this.megacities;

    if (this._localStorageService.hasUserLocation()) {
      const userLocation = this._localStorageService.getUserLocation();
      if (!this.foundCities.find((location) => location.fias === userLocation.fias)) {
        this.foundCities.unshift(userLocation);
      }
    }

    this.locationForm = this._fb.group({
      city: '',
    });

    this._cityChangesControl();
  }

  private _initCategoryForm() {
    this.categoryForm = this._fb.group({
      categoryName: undefined,
      selectedCategories: this._fb.array([]),
    });
    this._addCheckboxes();
  }

  private _initFilterForm() {
    this.filtersForm = this._fb.group(
      {
        supplier: this.supplierForm(),
        tradeMark: this.filters?.tradeMark,
        isDelivery: this.isNotFalse(this.filters?.isDelivery),
        isPickup: this.isNotFalse(this.filters?.isPickup),
        inStock: this.filters?.inStock,
        withImages: this.filters?.withImages,
        priceFrom: new FormControl(this.filters?.priceFrom, [priceConditionValidator]),
        priceTo: new FormControl(this.filters?.priceTo, [priceConditionValidator]),
        priceBetween: new FormControl([this.filters?.priceFrom || this.MIN_PRICE, this.filters?.priceTo || this.MAX_PRICE]),
      },
      {
        validator: [priceRangeConditionValidator],
      },
    );

    if (this.filters?.categoryId) {
      this.categoryId = this.filters.categoryId;
    }
    this._controlsPrices();
    this._filtersChangesControl();
  }

  private supplierForm() {
    return this._fb.group(
      {
        id: this.supplier?.id,
        name: this.supplier?.name,
        isSelected: this.supplier?.isSelected,
      },
      {
        validator: [supplierNameConditionValidator],
      },
    );
  }

  private _addCheckboxes() {
    if (this.categoryId) {
      this.categories.forEach((category, i) => {
        (this.categoryForm.controls.selectedCategories as FormArray).push(new FormControl(this.categoryId === category.id));
      });
    } else {
      this.categories.forEach((category, i) => {
        (this.categoryForm.controls.selectedCategories as FormArray).push(new FormControl(false));
      });
    }
  }

  private _controlsPrices() {
    this.filtersForm.controls.priceFrom.valueChanges.subscribe((price) => {
      this.filtersForm.controls.priceFrom.setValue(+price, { onlySelf: true, emitEvent: false });
      this.filtersForm.controls.priceBetween.setValue([+price, this.filtersForm.get('priceBetween').value[1]], {
        onlySelf: true,
        emitEvent: false,
      });
      if (price) {
        this._addActiveFilter('price');
      } else {
        this._removeActiveFilter('price');
      }
    });

    this.filtersForm.controls.priceTo.valueChanges.subscribe((price) => {
      this.filtersForm.controls.priceTo.setValue(+price, { onlySelf: true, emitEvent: false });
      this.filtersForm.controls.priceBetween.setValue([this.filtersForm.get('priceBetween').value[0], +price], {
        onlySelf: true,
        emitEvent: false,
      });
      if (price) {
        this._addActiveFilter('price');
      } else {
        this._removeActiveFilter('price');
      }
    });

    this.filtersForm.controls.priceBetween.valueChanges.subscribe((prices) => {
      this.filtersForm.controls.priceFrom.setValue(+prices[0], { onlySelf: true, emitEvent: false });
      this.filtersForm.controls.priceTo.setValue(+prices[1], { onlySelf: true, emitEvent: false });
      this.filtersForm.controls.priceBetween.setValue([+prices[0], +prices[1]], {
        onlySelf: true,
        emitEvent: false,
      });
      if (prices) {
        this._addActiveFilter('price');
      } else {
        this._removeActiveFilter('price');
      }
    });
  }

  private _categoryChangesControl() {
    this.categoryForm.controls.selectedCategories.valueChanges.subscribe((indexCategories) => {
      this.categoryForm.controls.selectedCategories.setValue(indexCategories, {
        onlySelf: true,
        emitEvent: false,
      });
      if (this.categoryId) {
        indexCategories.forEach((value, i) => {
          if (this.categoryId === this.categories[i].id) {
            this.categoryId = undefined;
            this.categoryIndex = undefined;
            this._removeActiveFilter('categoryId');
          }
          this.categories[i].disabled = false;
        });
      } else {
        indexCategories.forEach((value, i) => {
          if (value) {
            this.categoryId = this.categories[i].id;
            this.categoryIndex = i;
            this._addActiveFilter('categoryId');
          } else {
            this.categories[i].disabled = true;
          }
        });
      }
    });
  }

  private _cityChangesControl(): void {
    this.locationForm.controls.city.valueChanges
      .pipe(
        filter((cityName) => cityName.length > 1),
        switchMap((cityName) => {
          return combineLatest([of(cityName), this._locationService.searchLocations(cityName, Level.CITY)]);
        }),
      )
      .subscribe(
        ([city, cities]) => {
          this.foundCities = cities.filter((location) => location.name.toLowerCase().includes(city.toLowerCase()));
          this._cdr.detectChanges();
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        },
      );
  }

  private _addActiveFilter(value: string): void {
    this.activeFilters.add(value);
    this.filtersCount.emit(this.activeFilters);
  }

  private _removeActiveFilter(value: string): void {
    this.activeFilters.delete(value);
    this.filtersCount.emit(this.activeFilters);
  }

  private _filtersChangesControl(): void {
    this.filtersForm.controls.supplier.valueChanges.subscribe(
      (supplier) => {
        supplier.isSelected = false;

        this._removeActiveFilter('supplierId');
        if (supplier.name.trim().length > 3) {
          this._supplierService.findSuppliersBy(supplier.name, 0, PAGE_SIZE).subscribe((data) => {
            this.suppliers = this._map(data._embedded.suppliers);
            this._cdr.detectChanges();
          });
        } else {
          this.suppliers = null;
        }

        this.filtersForm.controls.supplier.setValue(supplier, { onlySelf: true, emitEvent: false });
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );

    this.filtersForm.controls.tradeMark.valueChanges.subscribe((tradeMark) => {
      this.filtersForm.controls.tradeMark.setValue(tradeMark, { onlySelf: true, emitEvent: false });
      if (tradeMark.length) {
        this._addActiveFilter('tradeMark');
      } else {
        this._removeActiveFilter('tradeMark');
      }
    });

    this.filtersForm.controls.isDelivery.valueChanges.subscribe((isDelivery) => {
      this.filtersForm.controls.isDelivery.setValue(isDelivery, { onlySelf: true, emitEvent: false });
      if (isDelivery) {
        this._removeActiveFilter('isDelivery');
      } else {
        this._addActiveFilter('isDelivery');
      }
    });

    this.filtersForm.controls.isPickup.valueChanges.subscribe((isPickup) => {
      this.filtersForm.controls.isPickup.setValue(isPickup, { onlySelf: true, emitEvent: false });
      if (isPickup) {
        this._removeActiveFilter('isPickup');
      } else {
        this._addActiveFilter('isPickup');
      }
    });

    this.filtersForm.controls.inStock.valueChanges.subscribe((inStock) => {
      this.filtersForm.controls.inStock.setValue(inStock, { onlySelf: true, emitEvent: false });
      if (inStock) {
        this._addActiveFilter('inStock');
      } else {
        this._removeActiveFilter('inStock');
      }
    });
    this.filtersForm.controls.withImages.valueChanges.subscribe((withImages) => {
      this.filtersForm.controls.withImages.setValue(withImages, { onlySelf: true, emitEvent: false });
      if (withImages) {
        this._addActiveFilter('withImages');
      } else {
        this._removeActiveFilter('withImages');
      }
    });
  }

  private _resetCategories(): void {
    this.categories.forEach((value, i) => {
      value.disabled = false;
      value.visible = true;
    });
  }

  private _map(suppliers: SuppliersItemModel[]) {
    suppliers.forEach((supplier) => {
      supplier.name = resizeBusinessStructure(supplier.name);
    });
    return suppliers;
  }

  private _activeFiltersCount(showSupplierMarker: boolean, showCategoryMarker: boolean) {
    this.activeFilters.clear();
    if (this.filters?.supplierId && showSupplierMarker) {
      this.activeFilters.add('supplierId');
    }
    if (this.filters?.tradeMark) {
      this.activeFilters.add('tradeMark');
    }
    if (this.filters?.isDelivery === false) {
      this.activeFilters.add('isDelivery');
    }
    if (this.filters?.isPickup === false) {
      this.activeFilters.add('isPickup');
    }
    if (this.filters?.inStock) {
      this.activeFilters.add('inStock');
    }
    if (this.filters?.withImages) {
      this.activeFilters.add('withImages');
    }
    if (this.filters?.priceFrom || this.filters?.priceTo) {
      this.activeFilters.add('price');
    }
    if (this.filters?.categoryId && showCategoryMarker) {
      this.activeFilters.add('categoryId');
    }
    this.filtersCount.emit(this.activeFilters);
  }

  private isNotFalse(flag: boolean) {
    return flag !== false;
  }
}
