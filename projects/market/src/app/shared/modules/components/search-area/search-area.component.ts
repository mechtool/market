import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SearchAreaService } from './search-area.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { unsubscribeList } from '#shared/utils';
import { Subscription } from 'rxjs';
import { DefaultSearchAvailableModel } from '#shared/modules/common-services/models/default-search-available.model';
import { AllGroupQueryFiltersModel } from '#shared/modules/common-services/models';

@Component({
  selector: 'market-search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss', './search-area.component-992.scss'],
  providers: [SearchAreaService],
})
export class SearchAreaComponent implements OnInit, OnDestroy {
  private _query = '';
  @Output() submitClick: EventEmitter<AllGroupQueryFiltersModel> = new EventEmitter();
  @Output() categoryIdClear: EventEmitter<any> = new EventEmitter();

  @Input() set query(val: string) {
    this._query = val || '';
  }
  @Input() filters: DefaultSearchAvailableModel = null;
  @Input() set summaryFeaturesData(data: any) {
    this._searchAreaService.newSummaryFeaturesData$(data);
  }

  @Input() set markerIsSupplierControlVisible(val: boolean) {
    this._searchAreaService.markerIsSupplierControlVisible = val;
  }

  @Input() set searchType(val: 'category' | 'supplier') {
    this._searchAreaService.searchType = val;
  }

  @Input() set filterCollapsed(val: boolean) {
    this._searchAreaService.filterCollapsed = val;
  }

  @Input() set enableSuggestions(val: boolean) {
    this._searchAreaService.enableSuggestions(val);
    this._searchAreaService.suggestionsEnabled = val;
  }

  @Input() set areCategoriesShown(val: boolean) {
    this._searchAreaService.areCategoriesShown = val;
  }

  @Input() set areAdditionalFiltersEnabled(val: boolean) {
    this._searchAreaService.areAdditionalFiltersEnabled = val;
  }

  get query(): string {
    return this._query;
  }

  get searchType(): 'category' | 'supplier' {
    return this._searchAreaService.searchType;
  }

  get filterCollapsed(): boolean {
    return this._searchAreaService.filterCollapsed;
  }

  get form(): FormGroup {
    return this._searchAreaService.form;
  }

  get areCategoriesShown(): boolean {
    return this._searchAreaService.areCategoriesShown;
  }

  get categoryId(): string {
    return this.filters?.categoryId || '';
  }

  private _submitChangesSubscription: Subscription;

  constructor(
    private _fb: FormBuilder,
    private _searchAreaService: SearchAreaService,
  ) {
  }

  ngOnInit() {
    this._submitChangesSubscription = this._searchAreaService.submitChanges$
      .pipe(
        debounceTime(this._searchAreaService.debounceTime),
        tap(() => this.form.updateValueAndValidity()),
        filter((res) => !!res && this.form.valid),
      )
      .subscribe((res) => {
        this._submitData();
      });
  }

  ngOnDestroy() {
    this._searchAreaService.closeOverlay();
    unsubscribeList([this._submitChangesSubscription]);
  }

  attachForm([form, controlName]: [FormGroup, string]) {
    this.form.setControl(controlName, form);
    this._fillForm(controlName);
  }

  private _submitData() {
    const data = {
      query: this.form.get('base.query').value,
      filters: {
        ...(this._isFormControlValueSubmittable('filters.supplier.id') && { supplierId: this.form.get('filters.supplier.id').value }),
        ...(this._isFormControlValueSubmittable('filters.tradeMark') && { tradeMark: this.form.get('filters.tradeMark').value }),
        ...(this._isFormControlValueSubmittable('filters.isDelivery') && { isDelivery: this.form.get('filters.isDelivery').value }),
        ...(this._isFormControlValueSubmittable('filters.isPickup') && { isPickup: this.form.get('filters.isPickup').value }),
        ...(this._isFormControlValueSubmittable('filters.inStock') && { inStock: this.form.get('filters.inStock').value }),
        ...(this._isFormControlValueSubmittable('filters.withImages') && { withImages: this.form.get('filters.withImages').value }),
        ...(this._isFormControlValueSubmittable('filters.hasDiscount') && { hasDiscount: this.form.get('filters.hasDiscount').value }),
        ...(this._isFormControlValueSubmittable('filters.features') && { features: this.form.get('filters.features').value }),
        ...(this._isFormControlValueSubmittable('filters.priceFrom') && { priceFrom: this.form.get('filters.priceFrom').value }),
        ...(this._isFormControlValueSubmittable('filters.priceTo') && { priceTo: this.form.get('filters.priceTo').value }),
        ...(this._isFormControlValueSubmittable('filters.subCategoryId') && {
          subCategoryId: this.form.get('filters.subCategoryId').value,
        }),
        ...(this.searchType !== 'supplier' && this._isFormControlValueSubmittable('base.categoryId') && { categoryId: this.form.get('base.categoryId').value }),
        ...(this._isFormControlValueSubmittable('filters.location.fias') && {
          deliveryArea: this.form.get('filters.location.fias').value,
          pickupArea: this.form.get('filters.location.fias').value,
        }),
      },
    };
    this.submitClick.emit(data);
  }

  private _isFormControlValueSubmittable(controlName: string): boolean {
    const valuesNotSubmittable = [null, ''];
    if (controlName === 'filters.location.fias') {
      valuesNotSubmittable.push('643');
    }
    const value = this.form.get(controlName).value;

    return Array.isArray(value) && !value.length ? false : !valuesNotSubmittable.some((x) => x === value);
  }

  private _fillForm(controlName: string): void {
    if (controlName === 'base') {
      this.form.get(controlName).patchValue({
        query: this.query,
        ...(this.areCategoriesShown && { categoryId: this.categoryId }),
      });
    }
    if (controlName === 'filters') {
      if (this.filters) {
        this.form.get(controlName).patchValue({
          ...(this.filters.tradeMark && { tradeMark: this.filters.tradeMark }),
          ...(this.filters.isDelivery !== undefined && this.filters.isDelivery !== null && { isDelivery: this.filters.isDelivery }),
          ...(this.filters.isPickup !== undefined && this.filters.isPickup !== null && { isPickup: this.filters.isPickup }),
          ...(this.filters.inStock !== undefined && this.filters.inStock !== null && { inStock: this.filters.inStock }),
          ...(this.filters.withImages !== undefined && this.filters.withImages !== null && { withImages: this.filters.withImages }),
          ...(this.filters.hasDiscount !== undefined && this.filters.hasDiscount !== null && { hasDiscount: this.filters.hasDiscount }),
          ...(this.filters.priceFrom && { priceFrom: this.filters.priceFrom }),
          ...(this.filters.priceTo && { priceTo: this.filters.priceTo }),
          ...((this.filters.priceFrom || this.filters.priceTo) && {
            priceRange: [
              this.filters.priceFrom || this.form.get('filters.priceFrom').value,
              this.filters.priceTo || this.form.get('filters.priceTo').value,
            ],
          }),
          ...(this.filters.supplierId && { supplier: { id: this.filters.supplierId } }),
          ...(this.filters.subCategoryId && { subCategoryId: this.filters.subCategoryId }),
        });

        if (this.filters.features?.length) {
          (this.form.get(controlName).get('features') as FormArray).clear();
          this.filters.features.forEach((val) => (this.form.get(controlName).get('features') as FormArray).push(this._fb.control(val)));
        }
      }
    }
  }
}
