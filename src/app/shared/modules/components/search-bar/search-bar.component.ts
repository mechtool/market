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
  isInputHovered = false;
  isInputFocused = false;
  quickSearchOver = false;
  visibleFilterForm = false;
  visibleLocationForm = false;
  MIN_QUERY_LENGTH = 3;
  userLocation: LocationModel;
  @Input() query = '';
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
    return this.form.get('query').value;
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
      this._updateForm();
    }
  }

  submit() {
    const queryParam = this.form.get('query').value;
    const groupAllQueryFilters = {
      query: queryParam,
      categoryId: this.categoryId,
      availableFilters: this.availableFilters || new DefaultSearchAvailableModel(),
      sort: this.sort,
    };
    if (queryParam.length >= this.MIN_QUERY_LENGTH) {
      this.submitClick.emit(groupAllQueryFilters);
    }
  }

  changeFilterButton($event: boolean) {
    this.visibleFilterForm = $event;
  }

  recFilter($event: DefaultSearchAvailableModel) {
    this.availableFilters = $event;
    if ($event) {
      this.visibleFilterForm = !this.visibleFilterForm;
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
      query: ['', [Validators.required, Validators.minLength(this.MIN_QUERY_LENGTH)]]
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
        filter(res => res.length >= this.MIN_QUERY_LENGTH),
      )
      .subscribe((res) => {
        this.queryChange.emit(res);
      }, (err) => {
        console.log('error');
      });
  }

  private _updateForm() {
    this.form.patchValue({ query: this.query || '' });
  }
}
