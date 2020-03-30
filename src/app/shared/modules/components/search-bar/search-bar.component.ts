import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DefaultSearchAvailableModel, LocalStorageService, ResponsiveService } from '../../common-services';
import { SuggestionCategoryItemModel, SuggestionProductItemModel } from '../../common-services/models';


@Component({
  selector: 'my-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: [
    './search-bar.component.scss',
    './search-bar.component-576.scss',
  ],
})
export class SearchBarComponent implements OnInit, OnDestroy, OnChanges {
  private _unsubscriber$: Subject<any> = new Subject();
  form: FormGroup;
  isInputHovered = false;
  isInputFocused = false;
  quickSearchOver = false;
  MIN_QUERY_LENGTH = 3;
  @Input() productsSuggestions: SuggestionProductItemModel[];
  @Input() categoriesSuggestions: SuggestionCategoryItemModel[];
  @Input() query = '';
  @Input() availableFilters: DefaultSearchAvailableModel;
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
    const queryText = this.form.get('query').value;
    const _availableFilters = this.form.get('availableFilters').value;
    const groupAllQueryFilters = {
      query: queryText,
      availableFilters: _availableFilters,
    };
    if (queryText.length >= this.MIN_QUERY_LENGTH) {
      this.submitClick.emit(groupAllQueryFilters);
      // this._localStorageService.putSearchText(query);
      // this._router.navigate(['/search'], {
      //   queryParams: {
      //     q: this.form.get('query').value,
      //   }
      // });
    }
  }

  screenWidthGreaterThan(val: number) {
    return this._responsiveService.screenWidthGreaterThan(val);
  }

  private _initForm(): void {
    // todo: availableFilters временная заглушак, поменять на реальный объек
    this.form = this._fb.group({
      query: ['', [Validators.required, Validators.minLength(this.MIN_QUERY_LENGTH)]],
      availableFilters: this._fb.group({
        supplier: '123456789',
        delivery: this._localStorageService.hasUserLocation() ? this._localStorageService.getUserLocation().fias : undefined,
        pickup: 'd8327a56-80de-4df2-815c-4f6ab1224c50',
        inStock: true,
        onlyWithImages: true,
        priceFrom: undefined,
        priceTo: undefined
      })
    });
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
