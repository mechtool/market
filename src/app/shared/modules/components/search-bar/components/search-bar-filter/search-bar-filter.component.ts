import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  CountryCode,
  DefaultSearchAvailableModel,
  DeliveryMethod,
  LocalStorageService
} from '../../../../common-services';
import { ActivatedRoute } from '@angular/router';


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

  deliveryOptions = [
    { label: 'Любой', value: DeliveryMethod.ANY },
    { label: 'Доставка', value: DeliveryMethod.DELIVERY },
    { label: 'Самовывоз', value: DeliveryMethod.PICKUP }
  ];

  @Input() availableFilters: DefaultSearchAvailableModel;
  @Output() stateAvailableFilters: EventEmitter<DefaultSearchAvailableModel> = new EventEmitter();

  constructor(
    private _localStorageService: LocalStorageService,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this._initForm();
    this._controlsPrices();
  }

  get inStock() {
    return this.availableFiltersForm.get('inStock').value;
  }

  get onlyWithImages() {
    return this.availableFiltersForm.get('onlyWithImages').value;
  }

  save() {
    // todo все переписать
    this._initFilter();

    const supplier = this.availableFiltersForm.get('supplier').value;
    if (supplier) {
      this.availableFilters.supplier = supplier;
    }
    const trademark = this.availableFiltersForm.get('trademark').value;
    if (trademark) {
      this.availableFilters.trademark = trademark;
    }

    const deliveryMethod = this.availableFiltersForm.get('deliveryMethod').value;
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

    this.availableFilters.inStock = this.availableFiltersForm.get('inStock').value;
    this.availableFilters.onlyWithImages = this.availableFiltersForm.get('onlyWithImages').value;

    const priceFrom = this.availableFiltersForm.get('priceFrom').value;
    if (priceFrom) {
      this.availableFilters.priceFrom = priceFrom;
    }

    const priceTo = this.availableFiltersForm.get('priceTo').value;
    if (priceTo) {
      this.availableFilters.priceTo = priceTo;
    }
    this.stateAvailableFilters.emit(this.availableFilters);
  }

  reset() {
    this.availableFilters = undefined;
    this.stateAvailableFilters.emit(this.availableFilters);
    this._initForm();
  }

  private _initForm() {

    this._initFilter();

    this.availableFiltersForm = this._fb.group({
      supplier: this.availableFilters.supplier,
      trademark: this.availableFilters.trademark,
      deliveryMethod: this.availableFilters.deliveryMethod,
      inStock: this.availableFilters.inStock,
      onlyWithImages: this.availableFilters.onlyWithImages,
      // todo: добавить валидацию на отрицательное число и запретить в форме отрицательные числа
      priceFrom: this.availableFilters.priceFrom,
      priceTo: this.availableFilters.priceTo,
      priceBetween: new FormControl([this.availableFilters.priceFrom || this.MIN_PRICE, this.availableFilters.priceTo || this.MAX_PRICE]),
    });
  }

  private _initFilter() {
    if (this.availableFilters === undefined) {
      this.availableFilters = new DefaultSearchAvailableModel();
    }
  }

  private userLocation(): string {
    if (this._localStorageService.hasUserLocation()) {
      const fias = this._localStorageService.getUserLocation().fias;
      return fias !== CountryCode.RUSSIA ? fias : null;
    }
    return null;
  }

  private _controlsPrices() {
    this.availableFiltersForm.controls['priceFrom'].valueChanges.subscribe((price) => {
      this.availableFiltersForm.controls['priceFrom'].setValue(+price, { onlySelf: true, emitEvent: false });
      this.availableFiltersForm.controls['priceBetween'].setValue(
        [+price, this.availableFiltersForm.get('priceBetween').value[1]], { onlySelf: true, emitEvent: false }
      );
    });

    this.availableFiltersForm.controls['priceTo'].valueChanges.subscribe((price) => {
      this.availableFiltersForm.controls['priceTo'].setValue(+price, { onlySelf: true, emitEvent: false });
      this.availableFiltersForm.controls['priceBetween'].setValue(
        [this.availableFiltersForm.get('priceBetween').value[0], +price], { onlySelf: true, emitEvent: false }
      );
    });

    this.availableFiltersForm.controls['priceBetween'].valueChanges.subscribe((prices) => {
      this.availableFiltersForm.controls['priceFrom'].setValue(+prices[0], { onlySelf: true, emitEvent: false }
      );
      this.availableFiltersForm.controls['priceTo'].setValue(+prices[1], { onlySelf: true, emitEvent: false }
      );
    });
  }
}
