import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import {
  AllGroupQueryFiltersModel,
  DefaultSearchAvailableModel,
  LocationModel,
  Megacity,
  SortModel,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel
} from '../../common-services/models';
import { UntilDestroy } from '@ngneat/until-destroy';
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
export class SearchBarComponent implements OnInit, OnChanges {
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
  @Input() filters: DefaultSearchAvailableModel;
  @Input() sort = SortModel.ASC;
  @Input() visibleSort = false;
  @Input() productsSuggestions: SuggestionProductItemModel[];
  @Input() categoriesSuggestions: SuggestionCategoryItemModel[];
  @Input() suggestionsOff = false;
  @Input() useBrowserStorage = true;
  @Input() filterVisible = true;
  @Output() queryChange: EventEmitter<string> = new EventEmitter();
  @Output() submitClick: EventEmitter<AllGroupQueryFiltersModel> = new EventEmitter();
  @Output() cityChange: EventEmitter<boolean> = new EventEmitter();

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
    return !this.filters?.categoryId && !this.filters?.trademark && !this.filters?.supplierId;
  }

  get filterCount(): number {
    return this.activeFilters.size > 0 ? this.activeFilters.size : null;
  }

  constructor(
    private _localStorageService: LocalStorageService,
    private _responsiveService: ResponsiveService,
    private _notificationsService: NotificationsService,
    private _fb: FormBuilder,
  ) {
    this._initForm();
  }

  ngOnInit(): void {
    this._initUserLocation();
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
        filters: this.filters,
        sort: this.sort,
      });
      this.visibleSuggestions = false;
    }
  }

  cleanQuery() {
    this.form.patchValue({ query: '' });
    this.submitClick.emit({
      query: null,
      filters: this.filters,
      sort: this.filters ? this.sort : null,
    });
  }

  recFilter(filters: DefaultSearchAvailableModel) {
    this.filters = filters;
    if (filters) {
      this.changeFilterFormVisibility(!this.isFilterFormVisible);
    }
    this.submitClick.emit({
      query: this.queryOrNull,
      filters: this.filters,
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
    if (this.filters?.isDelivery || this.filters?.isPickup) {
      this.cityChange.emit(true);
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
        filters: this.filters,
        sort: this.sort,
      });
    }
  }

  recFiltersCount(filterCount: Set<string>) {
    this.activeFilters = filterCount;
  }

  private _initForm(): void {
    this.form = this._fb.group({
      query: ['', [Validators.required, Validators.minLength(this.minQueryLength)]]
    });
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
}
