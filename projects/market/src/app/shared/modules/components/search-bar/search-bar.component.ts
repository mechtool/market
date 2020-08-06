import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import {
  AllGroupQueryFiltersModel,
  DefaultSearchAvailableModel,
  LocationModel,
  SortModel,
  Megacity,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel
} from '../../common-services/models';
import { ActivatedRoute, Params } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';
import { LocalStorageService, NotificationsService, ResponsiveService } from '#shared/modules/common-services';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: [
    './search-bar.component.scss',
    './search-bar.component-768.scss',
    './search-bar.component-576.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnChanges {
  activeFilters = new Set<string>();
  form: FormGroup;
  isInputFocused = false;
  isFilterFormVisible = false;
  visibleLocationForm = false;
  visibleSuggestions: boolean;
  userLocation: LocationModel;
  @Input() query: string;
  @Input() minQueryLength = 3;
  @Input() maxQueryLength = 20;
  @Input() placeholder = 'Поиск товаров';
  @Input() availableFilters: DefaultSearchAvailableModel;
  @Input() sort = SortModel.ASC;
  @Input() visibleSort = false;
  @Input() productsSuggestions: SuggestionProductItemModel[];
  @Input() categoriesSuggestions: SuggestionCategoryItemModel[];
  @Input() suggestionsOff = false;
  @Input() useBrowserStorage = true;
  @Input() filterVisible = true;
  @Output() queryChange: EventEmitter<string> = new EventEmitter();
  @Output() submitClick: EventEmitter<AllGroupQueryFiltersModel> = new EventEmitter();

  get searchQuery() {
    return this.form.get('query').value.trim();
  }

  get queryOrNull() {
    return this.searchQuery.length >= this.minQueryLength ? this.searchQuery : null;
  }

  get isShowSuggestions(): boolean {
    return !this.suggestionsOff &&
      ((this.searchQuery.length >= this.minQueryLength && (!!this.productsSuggestions || !!this.categoriesSuggestions)) ||
        this._localStorageService.hasSearchQueriesHistory());
  }

  get filterIsEmpty(): boolean {
    return !this.availableFilters?.categoryId && !this.availableFilters?.trademark && !this.availableFilters?.supplierId;
  }

  get filterCount(): number {
    return this.activeFilters.size > 0 ? this.activeFilters.size : null;
  }

  constructor(
    private _localStorageService: LocalStorageService,
    private _responsiveService: ResponsiveService,
    private _notificationsService: NotificationsService,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._initForm();

    if (!this.suggestionsOff) {
      this._subscribeOnQueryChanges();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.query) {
      this._cleanSuggestions();
      this._updateForm();
    }
  }

  submit() {
    if (this.queryOrNull || !this.filterIsEmpty) {
      this.submitClick.emit({
        query: this.queryOrNull,
        availableFilters: this.availableFilters,
        sort: this.sort,
      });
      this.visibleSuggestions = false;
    }
  }

  cleanQuery() {
    this.form.patchValue({ query: '' });
    this.submitClick.emit({
      query: null,
      availableFilters: this.availableFilters,
      sort: this.availableFilters ? this.sort : null,
    });
  }

  recFilter(filters: DefaultSearchAvailableModel) {
    this.availableFilters = filters;
    if (filters) {
      this.changeFilterFormVisibility(!this.isFilterFormVisible);
    }
    this.submitClick.emit({
      query: this.queryOrNull,
      availableFilters: this.availableFilters,
      sort: this.queryOrNull || !this.filterIsEmpty ? this.sort : null,
    });
  }

  changeFilterFormVisibility(isVisible: boolean) {
    this.isFilterFormVisible = isVisible;
  }

  changeAndCloseLocation(location: LocationModel) {
    this.changeLocation(location);
    this.visibleLocationForm = !this.visibleLocationForm;
  }

  changeLocation(location: LocationModel) {
    this.userLocation = location;
    if (this.availableFilters?.delivery) {
      this.availableFilters.delivery = location.fias;
    }
    if (this.availableFilters?.pickup) {
      this.availableFilters.pickup = location.fias;
    }
    if (this.availableFilters?.delivery || this.availableFilters?.pickup) {
      this.submit();
    }
  }

  changeLocationButton(isVisible: boolean) {
    this.visibleLocationForm = isVisible;
  }

  sortChange(sort: SortModel) {
    this.sort = sort;
    if (this.queryOrNull || !this.filterIsEmpty) {
      this.submitClick.emit({
        query: this.queryOrNull,
        availableFilters: this.availableFilters,
        sort: this.sort,
      });
    }
  }

  recFiltersCount(filterCount: Set<string>) {
    this.activeFilters = filterCount;
  }

  private _initForm(): void {
    this._initUserLocation();
    this.form = this._fb.group({
      query: ['', [Validators.required, Validators.minLength(this.minQueryLength)]]
    });
    combineLatest([
      this._activatedRoute.params,
      this._activatedRoute.queryParams,
    ]).subscribe(([params, queryParams]) => this._activeFiltersCount(params, queryParams));
  }

  private _initUserLocation(): void {
    if (this._localStorageService.hasUserLocation()) {
      this.userLocation = this._localStorageService.getUserLocation();
    } else {
      this._localStorageService.putUserLocation(Megacity.ALL[0]);
      this.userLocation = { name: 'Россия' };
    }
  }

  private _subscribeOnQueryChanges(): void {
    this.form.get('query').valueChanges
      .pipe(
        filter(res => res.trim().length >= this.minQueryLength && res.trim().length <= this.maxQueryLength),
      )
      .subscribe(
        (query) => {
          this.queryChange.emit(query.trim());
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        });
  }

  private _updateForm() {
    this.form.patchValue({ query: this.query || '' });
  }

  private _cleanSuggestions(): void {
    this.visibleSuggestions = false;
    this.productsSuggestions = null;
    this.categoriesSuggestions = null;
  }

  private _activeFiltersCount(params: Params, queryParams: Params) {
    this.activeFilters.clear();
    if (queryParams.supplierId) {
      this.activeFilters.add('supplierId');
    }
    if (queryParams.trademark) {
      this.activeFilters.add('trademark');
    }
    if (queryParams.delivery) {
      this.activeFilters.add('isDelivery');
    }
    if (queryParams.pickup) {
      this.activeFilters.add('isPickup');
    }
    if (queryParams.inStock) {
      this.activeFilters.add('inStock');
    }
    if (queryParams.withImages) {
      this.activeFilters.add('withImages');
    }
    if (queryParams.priceFrom || queryParams.priceTo) {
      this.activeFilters.add('price');
    }
    if (queryParams.categoryId || params.categoryId) {
      this.activeFilters.add('categoryId');
    }
  }
}
