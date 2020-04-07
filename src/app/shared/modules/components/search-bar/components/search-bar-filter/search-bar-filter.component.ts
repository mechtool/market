import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultSearchAvailableModel, DeliveryMethod, LocalStorageService } from '../../../../common-services';

@Component({
  selector: 'my-search-bar-filter',
  templateUrl: './search-bar-filter.component.html',
  styleUrls: [
    './search-bar-filter.component.scss',
  ],
})
export class SearchBarFilterComponent implements OnInit, OnDestroy {

  anyMethod = DeliveryMethod.ANY;
  deliveryMethod = DeliveryMethod.DELIVERY;
  pickupMethod = DeliveryMethod.PICKUP;
  availableFiltersForm: FormGroup;

  @Input() availableFilters: DefaultSearchAvailableModel;
  @Output() stateAvailableFilters: EventEmitter<DefaultSearchAvailableModel> = new EventEmitter();

  constructor(
    private _localStorageService: LocalStorageService,
    private _fb: FormBuilder,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this._initForm();
  }

  get getDeliveryMethod() {
    return this.availableFiltersForm.get('deliveryMethod').value;
  }

  get inStock() {
    return this.availableFiltersForm.get('inStock').value;
  }

  get onlyWithImages() {
    return this.availableFiltersForm.get('onlyWithImages').value;
  }

  private userLocation(): string {
    return this._localStorageService.hasUserLocation() ? this._localStorageService.getUserLocation().fias : undefined;
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
      if (deliveryMethod === 'any') {
        this.availableFilters.delivery = this.userLocation();
        this.availableFilters.pickup = this.userLocation();
      } else if (deliveryMethod === 'delivery') {
        this.availableFilters.delivery = this.userLocation();
      } else if (deliveryMethod === 'pickup') {
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
      priceTo: this.availableFilters.priceTo
    });
  }

  private _initFilter() {
    if (this.availableFilters === undefined) {
      this.availableFilters = new DefaultSearchAvailableModel();
    }
  }
}
