import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  AllGroupQueryFiltersModel,
  DefaultSearchAvailableModel,
  LocalStorageService,
  LocationModel,
  ResponsiveService,
  SortModel
} from '../../common-services';
import { SuggestionCategoryItemModel, SuggestionProductItemModel } from '../../common-services/models';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'my-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: [
    './search-bar.component.scss',
    './search-bar.component-768.scss',
    './search-bar.component-576.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnDestroy, OnChanges {
  private _unsubscriber$: Subject<any> = new Subject();
  private _filterCount: number;
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
    return !this.availableFilters?.categoryId && !this.availableFilters?.trademark && !this.availableFilters?.supplier;
  }

  get filterCount(): number {
    return this._filterCount > 0 ? this._filterCount : null;
  }

  constructor(
    private _localStorageService: LocalStorageService,
    private _responsiveService: ResponsiveService,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._initForm();

    if (!this.suggestionsOff) {
      this._subscribeOnQueryChanges();
    }
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
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
    if (!filters) {
      this.submitClick.emit({
        query: this.queryOrNull,
        availableFilters: null,
        sort: this.queryOrNull ? this.sort : null,
      });
    }
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

  recFiltersCount(filterCount: number) {
    this._filterCount = filterCount;
  }

  private _initForm(): void {
    this._initUserLocation();
    this.form = this._fb.group({
      query: ['', [Validators.required, Validators.minLength(this.minQueryLength)]]
    });
    this._activatedRoute.queryParams
      .subscribe(queryParams => this._activeFiltersCount(queryParams));
  }

  private _initUserLocation(): void {
    if (this._localStorageService.hasUserLocation()) {
      this.userLocation = this._localStorageService.getUserLocation();
    } else {
      this.userLocation = { name: 'Россия' };
    }
  }

  private _subscribeOnQueryChanges(): void {
    this.form.get('query').valueChanges
      .pipe(
        takeUntil(this._unsubscriber$),
        filter(res => res.trim().length >= this.minQueryLength && res.trim().length <= this.maxQueryLength),
      )
      .subscribe((res) => {
        this.queryChange.emit(res.trim());
      }, (err) => {
        console.log('error');
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

  private _activeFiltersCount(queryParams: Params) {
    this._filterCount = 0;
    if (queryParams.supplier) {
      this._filterCount++;
    }
    if (queryParams.trademark) {
      this._filterCount++;
    }
    if (queryParams.delivery) {
      this._filterCount++;
    }
    if (queryParams.pickup) {
      this._filterCount++;
    }
    if (queryParams.inStock) {
      this._filterCount++;
    }
    if (queryParams.withImages) {
      this._filterCount++;
    }
    if (queryParams.priceFrom || queryParams.priceTo) {
      this._filterCount++;
    }
    if (queryParams.categoryId) {
      this._filterCount++;
    }
  }
}
