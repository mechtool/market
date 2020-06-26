import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  CategoryModel,
  CategoryService,
  CountryCode,
  DefaultSearchAvailableModel,
  DeliveryMethod,
  LocalStorageService
} from '../../../../common-services';
import { ActivatedRoute } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { combineLatest, throwError } from 'rxjs';


@Component({
  selector: 'my-search-bar-filter',
  templateUrl: './search-bar-filter.component.html',
  styleUrls: [
    './search-bar-filter.component.scss',
    './search-bar-filter.component-400.scss',
    './search-bar-filter.component-360.scss',
  ],
})
export class SearchBarFilterComponent implements OnInit, OnDestroy {

  MIN_PRICE = 0;
  MAX_PRICE = 1000000;
  availableFiltersForm: FormGroup;
  categoryFiltersForm: FormGroup;
  flag = false;

  deliveryOptions = [
    { label: 'Любой', value: DeliveryMethod.ANY },
    { label: 'Доставка', value: DeliveryMethod.DELIVERY },
    { label: 'Самовывоз', value: DeliveryMethod.PICKUP }
  ];

  selectedCategoriesIds: string[] = [];
  @Input() availableFilters: DefaultSearchAvailableModel;
  @Output() stateAvailableFilters: EventEmitter<DefaultSearchAvailableModel> = new EventEmitter();

  categories: CategoryModel[];

  constructor(
    private _localStorageService: LocalStorageService,
    private _categoryService: CategoryService,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
  ) {
    this._initForm();
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  get inStock() {
    return this.availableFiltersForm.controls.inStock.value;
  }

  get withImages() {
    return this.availableFiltersForm.controls.withImages.value;
  }

  save() {
    // todo все переписать
    this._newAvailableFilter();

    const supplier = this.availableFiltersForm.controls.supplier.value;
    if (supplier) {
      this.availableFilters.supplier = supplier;
    }
    const trademark = this.availableFiltersForm.controls.trademark.value;
    if (trademark) {
      this.availableFilters.trademark = trademark;
    }

    const deliveryMethod = this.availableFiltersForm.controls.deliveryMethod.value;
    if (deliveryMethod) {
      this.availableFilters.deliveryMethod = deliveryMethod;
      if (deliveryMethod === DeliveryMethod.ANY) {
        this.availableFilters.delivery = this.userLocation();
        this.availableFilters.pickup = this.userLocation();
      } else if (deliveryMethod === DeliveryMethod.DELIVERY) {
        this.availableFilters.delivery = this.userLocation();
      } else if (deliveryMethod === DeliveryMethod.PICKUP) {
        this.availableFilters.pickup = this.userLocation();
      }
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

    if (this.selectedCategoriesIds.length) {
      if (Array.isArray(this.selectedCategoriesIds)) {
        this.availableFilters.categories = new Set<string>(this.selectedCategoriesIds);
      } else {
        this.availableFilters.categories = new Set<string>([this.selectedCategoriesIds]);
      }
    }
    this.stateAvailableFilters.emit(this.availableFilters);
  }

  reset() {
    this.availableFilters = undefined;
    this.stateAvailableFilters.emit(this.availableFilters);
    this._initForm();
  }

  private _initForm() {
    combineLatest([
      this._activatedRoute.params,
      this._activatedRoute.queryParams,
    ])
      .pipe(
        switchMap(([params, queryParams]) => {
          const supplierId = params.id;
          if (queryParams.categories) {
            this.selectedCategoriesIds.push(...queryParams.categories);
          }
          if (supplierId) {
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
        this.categories.forEach((res) => {
          res.visible = true;
        });

        this._newAvailableFilter();
        this._initFilters();
      });
  }

  private addCheckboxes() {
    if (this.selectedCategoriesIds.length) {
      this.categories.forEach((category, i) => {
        (this.categoryFiltersForm.controls.selectedCategories as FormArray)
          .push(new FormControl(this.selectedCategoriesIds.includes(category.id)));
      });
    } else {
      this.categories.forEach((category, i) => {
        (this.categoryFiltersForm.controls.selectedCategories as FormArray).push(new FormControl(false));
      });
    }
  }

  private _newAvailableFilter() {
    if (this.availableFilters === undefined) {
      this.availableFilters = new DefaultSearchAvailableModel();
    }
  }

  private _initFilters() {
    this.availableFiltersForm = this._fb.group({
      supplier: this.availableFilters.supplier,
      trademark: this.availableFilters.trademark,
      deliveryMethod: this.availableFilters.deliveryMethod || DeliveryMethod.ANY,
      inStock: this.availableFilters.inStock,
      withImages: this.availableFilters.withImages,
      // todo: добавить валидацию на отрицательное число и запретить в форме отрицательные числа
      priceFrom: this.availableFilters.priceFrom,
      priceTo: this.availableFilters.priceTo,
      priceBetween: new FormControl([this.availableFilters.priceFrom || this.MIN_PRICE, this.availableFilters.priceTo || this.MAX_PRICE]),
    });

    this.categoryFiltersForm = this._fb.group({
      categoryName: undefined,
      selectedCategories: new FormArray([]),
    });

    if (this.availableFilters.categories?.size) {
      this.selectedCategoriesIds = Array.from(this.availableFilters.categories);
    }

    this.addCheckboxes();
    this._controlsPrices();
    this._subscribeOnParamsChanges();
  }

  private userLocation(): string {
    if (this._localStorageService.hasUserLocation()) {
      const fias = this._localStorageService.getUserLocation().fias;
      return fias !== CountryCode.RUSSIA ? fias : null;
    }
    return null;
  }

  private _controlsPrices() {
    this.availableFiltersForm.controls.priceFrom.valueChanges.subscribe((price) => {
      this.availableFiltersForm.controls.priceFrom.setValue(+price, { onlySelf: true, emitEvent: false });
      this.availableFiltersForm.controls.priceBetween.setValue(
        [+price, this.availableFiltersForm.get('priceBetween').value[1]], { onlySelf: true, emitEvent: false }
      );
    });

    this.availableFiltersForm.controls.priceTo.valueChanges.subscribe((price) => {
      this.availableFiltersForm.controls.priceTo.setValue(+price, { onlySelf: true, emitEvent: false });
      this.availableFiltersForm.controls.priceBetween.setValue(
        [this.availableFiltersForm.get('priceBetween').value[0], +price], { onlySelf: true, emitEvent: false }
      );
    });

    this.availableFiltersForm.controls.priceBetween.valueChanges.subscribe((prices) => {
      this.availableFiltersForm.controls.priceFrom.setValue(+prices[0], { onlySelf: true, emitEvent: false }
      );
      this.availableFiltersForm.controls.priceTo.setValue(+prices[1], { onlySelf: true, emitEvent: false }
      );
    });
  }

  private _subscribeOnParamsChanges() {
    this.categoryFiltersForm.controls.categoryName.valueChanges.subscribe((query) => {
      this.categories.forEach((res) => {
        res.visible = res.name.toLowerCase().includes(query);
      });
    });

    this.categoryFiltersForm.controls.selectedCategories.valueChanges.subscribe((indexCategories) => {
      this.selectedCategoriesIds = [];
      indexCategories
        .forEach((value, i) => {
          if (value) {
            this.selectedCategoriesIds.push(this.categories[i].id);
          }
        });
    });
  }
}
