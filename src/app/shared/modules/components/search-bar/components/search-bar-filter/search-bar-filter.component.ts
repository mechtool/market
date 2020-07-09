import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  CategoryModel,
  CategoryService,
  CountryCode,
  DefaultSearchAvailableModel,
  LocalStorageService,
  LocationModel,
  LocationService,
  Megacity
} from '../../../../common-services';
import { ActivatedRoute } from '@angular/router';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { combineLatest, of, throwError } from 'rxjs';


@Component({
  selector: 'my-search-bar-filter',
  templateUrl: './search-bar-filter.component.html',
  styleUrls: [
    './search-bar-filter.component.scss',
    './search-bar-filter.component-768.scss',
    './search-bar-filter.component-575.scss',
    './search-bar-filter.component-400.scss',
    './search-bar-filter.component-360.scss',
  ],
})
export class SearchBarFilterComponent {
  MIN_PRICE = 0;
  MAX_PRICE = 1000000;
  availableFiltersForm: FormGroup;
  categoryFiltersForm: FormGroup;
  locationForm: FormGroup;
  categoryId: string;
  categories: CategoryModel[];
  searchByInn = true;
  showFilterWithCities = false;
  showFilterWithCategories = false;
  notShowFilter = false;
  foundCities: LocationModel[] = [];
  megacities = Megacity.ALL;
  activeFilters = new Set<string>();

  @Input() availableFilters: DefaultSearchAvailableModel;
  @Input() city: string;
  @Output() stateAvailableFilters: EventEmitter<DefaultSearchAvailableModel> = new EventEmitter();
  @Output() stateLocation: EventEmitter<LocationModel> = new EventEmitter();
  @Output() closeFilter: EventEmitter<boolean> = new EventEmitter();
  @Output() stateLocationForm: EventEmitter<LocationModel> = new EventEmitter();
  @Output() filtersCount: EventEmitter<number> = new EventEmitter();

  constructor(
    private _locationService: LocationService,
    private _localStorageService: LocalStorageService,
    private _categoryService: CategoryService,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
  ) {
    this._init();
  }

  get inStock() {
    return this.availableFiltersForm.controls.inStock.value;
  }

  get withImages() {
    return this.availableFiltersForm.controls.withImages.value;
  }

  get userLocation(): string {
    if (this._localStorageService.hasUserLocation()) {
      const fias = this._localStorageService.getUserLocation().fias;
      return fias !== CountryCode.RUSSIA ? fias : null;
    }
    return null;
  }

  save() {
    this._saveFilters();
    this.stateAvailableFilters.emit(this.availableFilters);
  }

  reset() {
    this.availableFilters = undefined;
    this.categoryId = undefined;
    this.stateAvailableFilters.emit(this.availableFilters);
    this.activeFilters.clear();
    this.filtersCount.emit(0);
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

  private _init() {
    combineLatest([
      this._activatedRoute.params,
      this._activatedRoute.queryParams,
    ])
      .pipe(
        switchMap(([params, queryParams]) => {
          const supplierId = params.id;
          if (queryParams.categoryId) {
            this.categoryId = queryParams.categoryId;
          }
          if (supplierId) {
            this.searchByInn = false;
            return this._categoryService.getAllSupplierCategories({ suppliers: [supplierId] });
          }
          return this._categoryService.getAllSupplierCategories();
        }),
        catchError((err) => {
          console.error('error', err);
          return throwError(err);
        })
      )
      .subscribe((categories) => {
        this.categories = categories;
        if (this.categoryId) {
          this.categories.forEach((category) => {
            if (category.id !== this.categoryId) {
              category.disabled = true;
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
      });
  }

  private _saveFilters() {
    if (!this.availableFilters) {
      this.availableFilters = new DefaultSearchAvailableModel();
    }

    const supplier = this.availableFiltersForm.controls.supplier.value;
    if (supplier) {
      this.availableFilters.supplier = supplier;
    }
    const trademark = this.availableFiltersForm.controls.trademark.value;
    if (trademark) {
      this.availableFilters.trademark = trademark;
    }

    if (this.availableFiltersForm.controls.isDelivery.value) {
      this.availableFilters.delivery = this.userLocation;
    }

    if (this.availableFiltersForm.controls.isPickup.value) {
      this.availableFilters.pickup = this.userLocation;
    }

    this.availableFilters.inStock = this.availableFiltersForm.controls.inStock.value;
    this.availableFilters.withImages = this.availableFiltersForm.controls.withImages.value;

    const priceFrom = this.availableFiltersForm.controls.priceFrom.value;
    if (priceFrom) {
      this.availableFilters.priceFrom = priceFrom;
    }

    const priceTo = this.availableFiltersForm.controls.priceTo.value;
    if (priceTo) {
      this.availableFilters.priceTo = priceTo;
    }

    if (this.categoryId) {
      this.availableFilters.categoryId = this.categoryId;
    }
  }

  private _initForms() {
    this._initFormAvailableFilter();
    this._initFormCategoryFilter();
    this._initFormLocationFilter();
  }


  private _initFormLocationFilter() {
    this.foundCities = this.megacities;

    if (this._localStorageService.hasUserLocation()) {
      const userLocation = this._localStorageService.getUserLocation();
      if (!this.foundCities.find(res => res.fias === userLocation.fias)) {
        this.foundCities.unshift(userLocation);
      }
    }

    this.locationForm = this._fb.group({
      city: ''
    });

    this._cityChangesControl();
  }

  private _initFormCategoryFilter() {
    this.categoryFiltersForm = this._fb.group({
      categoryName: undefined,
      selectedCategories: new FormArray([]),
    });
    this._addCheckboxes();
  }

  private _initFormAvailableFilter() {
    this.availableFiltersForm = this._fb.group({
      supplier: this.availableFilters?.supplier,
      trademark: this.availableFilters?.trademark,
      isDelivery: !!this.availableFilters?.delivery,
      isPickup: !!this.availableFilters?.pickup,
      inStock: this.availableFilters?.inStock,
      withImages: this.availableFilters?.withImages,
      priceFrom: this.availableFilters?.priceFrom,
      priceTo: this.availableFilters?.priceTo,
      priceBetween: new FormControl([this.availableFilters?.priceFrom || this.MIN_PRICE, this.availableFilters?.priceTo || this.MAX_PRICE]),
    });

    if (this.availableFilters?.categoryId) {
      this.categoryId = this.availableFilters.categoryId;
    }
    this._controlsPrices();
    this._filtersChangesControl();
  }

  private _addCheckboxes() {
    if (this.categoryId) {
      this.categories.forEach((category, i) => {
        (this.categoryFiltersForm.controls.selectedCategories as FormArray)
          .push(new FormControl(this.categoryId === category.id));
      });
    } else {
      this.categories.forEach((category, i) => {
        (this.categoryFiltersForm.controls.selectedCategories as FormArray).push(new FormControl(false));
      });
    }
  }

  private _controlsPrices() {
    this.availableFiltersForm.controls.priceFrom.valueChanges.subscribe((price) => {
      this.availableFiltersForm.controls.priceFrom.setValue(+price, { onlySelf: true, emitEvent: false });
      this.availableFiltersForm.controls.priceBetween.setValue(
        [+price, this.availableFiltersForm.get('priceBetween').value[1]], { onlySelf: true, emitEvent: false }
      );
      if (price) {
        this._addActiveFilter('price');
      } else {
        this._removeActiveFilter('price');
      }
    });

    this.availableFiltersForm.controls.priceTo.valueChanges.subscribe((price) => {
      this.availableFiltersForm.controls.priceTo.setValue(+price, { onlySelf: true, emitEvent: false });
      this.availableFiltersForm.controls.priceBetween.setValue(
        [this.availableFiltersForm.get('priceBetween').value[0], +price], { onlySelf: true, emitEvent: false }
      );
      if (price) {
        this._addActiveFilter('price');
      } else {
        this._removeActiveFilter('price');
      }
    });

    this.availableFiltersForm.controls.priceBetween.valueChanges.subscribe((prices) => {
      this.availableFiltersForm.controls.priceFrom.setValue(+prices[0], { onlySelf: true, emitEvent: false }
      );
      this.availableFiltersForm.controls.priceTo.setValue(+prices[1], { onlySelf: true, emitEvent: false }
      );
      if (prices) {
        this._addActiveFilter('price');
      } else {
        this._removeActiveFilter('price');
      }
    });
  }

  private _categoryChangesControl() {
    this.categoryFiltersForm.controls.categoryName.valueChanges.subscribe((query) => {
      this.categories.forEach((res) => {
        res.visible = res.name.toLowerCase().includes(query);
      });
    });

    this.categoryFiltersForm.controls.selectedCategories.valueChanges.subscribe((indexCategories) => {
      if (this.categoryId) {
        indexCategories
          .forEach((value, i) => {
            if (this.categoryId === this.categories[i].id) {
              this.categoryId = undefined;
              this._removeActiveFilter('categoryId');
            }
            this.categories[i].disabled = false;
          });
      } else {
        indexCategories
          .forEach((value, i) => {
            if (value) {
              this.categoryId = this.categories[i].id;
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
        filter(cityName => cityName.length > 1),
        switchMap((cityName) => {
          return combineLatest([of(cityName), this._locationService.searchLocations(cityName)]);
        })
      )
      .subscribe(([city, cities]) => {
        // todo:  Избавиться от лага с двойным кликом по выбранному городу
        this.foundCities = cities.filter(r => r.name.toLowerCase().includes(city));
      }, (err) => {
        console.error(err);
      });
  }

  private _addActiveFilter(value: string): void {
    this.activeFilters.add(value);
    this.filtersCount.emit(this.activeFilters.size);
  }

  private _removeActiveFilter(value: string): void {
    this.activeFilters.delete(value);
    this.filtersCount.emit(this.activeFilters.size);
  }

  private _filtersChangesControl(): void {

    this.availableFiltersForm.controls.supplier.valueChanges.subscribe((supplier) => {
      if (supplier.length) {
        this._addActiveFilter('supplier');
      } else {
        this._removeActiveFilter('supplier');
      }
    });
    this.availableFiltersForm.controls.trademark.valueChanges.subscribe((trademark) => {
      if (trademark.length) {
        this._addActiveFilter('trademark');
      } else {
        this._removeActiveFilter('trademark');
      }
    });

    this.availableFiltersForm.controls.isDelivery.valueChanges.subscribe((isDelivery) => {
      if (isDelivery) {
        this._addActiveFilter('isDelivery');
      } else {
        this._removeActiveFilter('isDelivery');
      }
    });

    this.availableFiltersForm.controls.isPickup.valueChanges.subscribe((isPickup) => {
      if (isPickup) {
        this._addActiveFilter('isPickup');
      } else {
        this._removeActiveFilter('isPickup');
      }
    });

    this.availableFiltersForm.controls.inStock.valueChanges.subscribe((inStock) => {
      if (inStock) {
        this._addActiveFilter('inStock');
      } else {
        this._removeActiveFilter('inStock');
      }
    });
    this.availableFiltersForm.controls.withImages.valueChanges.subscribe((withImages) => {
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

}
