import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DefaultSearchAvailableModel, LocalStorageService, ResponsiveService } from '../../common-services';
import { SuggestionCategoryItemModel, SuggestionProductItemModel } from '../../common-services/models';
import { Router } from '@angular/router';


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
  visibleFilterForm = false;
  MIN_QUERY_LENGTH = 3;
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
    const availableFiltersParam = this.form.get('availableFilters').value;
    const groupAllQueryFilters = {
      query: queryParam,
      availableFilters: availableFiltersParam,
    };
    if (queryParam.length >= this.MIN_QUERY_LENGTH) {
      this.submitClick.emit(groupAllQueryFilters);
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
        supplier: undefined,
        delivery: undefined,
        pickup: undefined,
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

  clickFilterButton($event: MouseEvent) {
    this.visibleFilterForm = !this.visibleFilterForm;
  }

  recFilter($event: DefaultSearchAvailableModel) {
    this.availableFilters = $event;
    if ($event) {
      this.visibleFilterForm = !this.visibleFilterForm;
    }
  }
}
