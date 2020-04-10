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
  DefaultSearchAvailableModel,
  LocalStorageService,
  LocationModel,
  ResponsiveService
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
  availableFilters: DefaultSearchAvailableModel;
  @Input() productsSuggestions: SuggestionProductItemModel[];
  @Input() categoriesSuggestions: SuggestionCategoryItemModel[];
  @Input() query = '';
  @Input() useBrowserStorage = true;
  @Output() queryChange: EventEmitter<any> = new EventEmitter();
  @Output() submitClick: EventEmitter<any> = new EventEmitter();

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
    this._subscribeOnQueryChanges();
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
      availableFilters: this.availableFilters || new DefaultSearchAvailableModel(),
    };
    if (queryParam.length >= this.MIN_QUERY_LENGTH) {
      this.submitClick.emit(groupAllQueryFilters);
    }
  }

  screenWidthGreaterThan(val: number) {
    return this._responsiveService.screenWidthGreaterThan(val);
  }

  clickFilterButton() {
    this.visibleLocationForm = false;
    this.visibleFilterForm = !this.visibleFilterForm;
  }

  recFilter($event: DefaultSearchAvailableModel) {
    this.availableFilters = $event;
    if ($event) {
      this.visibleFilterForm = !this.visibleFilterForm;
    }
  }

  recLocation($event: LocationModel) {
    this.visibleLocationForm = !this.visibleLocationForm;
    this.userLocation = $event;
  }

  clickLocationButton() {
    this.visibleLocationForm = !this.visibleLocationForm;
    this.visibleFilterForm = false;
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
