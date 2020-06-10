import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
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
import { Router } from '@angular/router';


@Component({
  selector: 'my-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: [
    './search-bar.component.scss',
    './search-bar.component-576.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscriber$: Subject<any> = new Subject();
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
  @Input() categoryId: string;
  @Input() useBrowserStorage = true;
  @Output() queryChange: EventEmitter<string> = new EventEmitter();
  @Output() submitClick: EventEmitter<AllGroupQueryFiltersModel> = new EventEmitter();

  get searchQuery() {
    return this.form.get('query').value.trim();
  }

  get isShowSuggestions(): boolean {
    return !this.suggestionsOff &&
      ((this.searchQuery.length >= this.minQueryLength && (!!this.productsSuggestions || !!this.categoriesSuggestions)) ||
        this._localStorageService.hasSearchQueriesHistory());
  }

  constructor(
    private _localStorageService: LocalStorageService,
    private _responsiveService: ResponsiveService,
    private _fb: FormBuilder,
    private _router: Router,
  ) {
    this._initForm();

    if (!this.suggestionsOff) {
      this._subscribeOnQueryChanges();
    }
  }

  ngOnInit() {
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
    const queryText = this.searchQuery;
    const groupAllQueryFilters = {
      query: queryText,
      categoryId: this.categoryId,
      availableFilters: this.availableFilters || new DefaultSearchAvailableModel(),
      sort: this.sort,
    };
    if (queryText.length >= this.minQueryLength) {
      this.submitClick.emit(groupAllQueryFilters);
      this.visibleSuggestions = false;
    }
  }

  cleanQuery() {
    this.form.patchValue({ query: '' });
    this.submitClick.emit({ query: undefined });
  }

  changeFilterFormVisibility($event: boolean) {
    this.isFilterFormVisible = $event;
  }

  recFilter($event: DefaultSearchAvailableModel) {
    this.availableFilters = $event;
    if ($event) {
      this.isFilterFormVisible = !this.isFilterFormVisible;
    }
  }

  recLocation($event: LocationModel) {
    this.userLocation = $event;
    this.visibleLocationForm = !this.visibleLocationForm;
    if (this.availableFilters) {
      if (this.availableFilters.delivery) {
        this.availableFilters.delivery = $event.fias;
      }
      if (this.availableFilters.pickup) {
        this.availableFilters.pickup = $event.fias;
      }
    }
  }

  changeLocationButton($event: boolean) {
    this.visibleLocationForm = $event;
  }

  sortChange($event: SortModel) {
    this.sort = $event;
  }

  private _initForm(): void {
    this._initUserLocation();
    this.form = this._fb.group({
      query: ['', [Validators.required, Validators.minLength(this.minQueryLength)]]
    });
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
}
