import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '#shared/modules/common-services';
import { SearchAreaService } from '../../search-area.service';
import { catchError, debounceTime, filter, map, startWith, switchMap } from 'rxjs/operators';
import { combineLatest, defer, fromEvent, Observable, of, Subscription } from 'rxjs';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { unsubscribeList } from '#shared/utils';

const PLACEHOLDER_DEFAULT_TEXT = 'Искать товары';
const PLACEHOLDER_CATEGORY_SELECTED_TEXT = 'Искать в категории';
const SCREEN_WIDTH_BREAKPOINT = 992;

@Component({
  selector: 'market-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss', './search-box.component-768.scss', './search-box.component-576.scss'],
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  get suggestionsEnabled(): boolean {
    return this._searchAreaService.suggestionsEnabled;
  }

  get suggestionsType(): 'history' | 'products' {
    return this._searchAreaService.suggestionsType;
  }

  get areCategoriesShown(): boolean {
    return this._searchAreaService.areCategoriesShown;
  }

  @Output() formInitialized: EventEmitter<[FormGroup, string]> = new EventEmitter<any>();
  @Output() submitClick: EventEmitter<any> = new EventEmitter();
  private _minQueryLength = 3;
  private _maxQueryLength = 20;
  form: FormGroup;
  placeholder = PLACEHOLDER_DEFAULT_TEXT;

  private _keyUpChangeSubscription: Subscription;
  private _activeResultsItemChangeSubscription: Subscription;
  private _focusQuerySubscription: Subscription;
  private _categoryIdSubscription: Subscription;
  private _escapeKeySubscription: Subscription;
  private _resizeSubscription: Subscription;
  private _searchFilterComponentInstanceSubscription: Subscription;

  @Input() set enableSuggestions(val: boolean) {
    this._searchAreaService.enableSuggestions(val);
    this._searchAreaService.suggestionsEnabled = val;
  }

  @Input() set minQueryLength(val: number) {
    this._minQueryLength = val;
    this.form.get('query').setValidators([Validators.required, Validators.minLength(val)]);
  }

  get minQueryLength(): number {
    return this._minQueryLength;
  }

  get maxQueryLength(): number {
    return this._maxQueryLength;
  }

  get searchQuery(): string {
    return this.form.get('query').value.trim();
  }

  get modifiedFiltersCounter$(): Observable<number> {
    return this._searchAreaService.modifiedFiltersCounter$;
  }

  get focusChange$(): Observable<boolean> {
    return this._searchAreaService.focusChange$;
  }

  get debouncedQueryChange$(): Observable<string> {
    return this.form.get('query').valueChanges.pipe(debounceTime(this._searchAreaService.debounceTime), startWith(''));
  }

  get keyUpChange$(): Observable<KeyboardEvent> {
    return this._searchAreaService.keyUpChange$.pipe(filter((e) => !!e));
  }

  get activeResultsItemChange$(): Observable<{ text: string; type: string }> {
    return this._searchAreaService.activeResultsItemChange$.pipe(filter((e: any) => e?.text));
  }

  get filterCollapsed(): boolean {
    return this._searchAreaService.filterCollapsed;
  }

  constructor(
    private _searchAreaService: SearchAreaService,
    private _spinnerService: SpinnerService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _overlay: Overlay,
    private _injector: Injector,
  ) {
  }

  ngOnInit(): void {
    try {
      this._initForm();
      this._attachForm();
      this._setPlaceholder();
      this._handleEscapeChanges();
      this._handleResizeChanges();
      this._handleKeyUpChange();
      if (this._searchAreaService.suggestionsEnabled) {
        this._handleFocusQueryChanges();
        this._handleActiveResultsItemChange();
      }
      if (this.form.get('categoryId')?.value) {
        this._handleCategoryIdChanges();
      }
    }catch (err){}
  }

  ngOnDestroy() {
    unsubscribeList([
      this._keyUpChangeSubscription,
      this._activeResultsItemChangeSubscription,
      this._focusQuerySubscription,
      this._categoryIdSubscription,
      this._escapeKeySubscription,
      this._resizeSubscription,
      this._searchFilterComponentInstanceSubscription,
    ]);
  }

  private _initForm(): void {
    this.form = this._fb.group({
      query: [''],
      ...(this.areCategoriesShown && { categoryId: '' }),
    });
  }

  private _attachForm(): void {
    this.formInitialized.emit([this.form, 'base']);
  }

  private _setPlaceholder(): void {
    if (this.form.get('categoryId')?.value) {
      this.placeholder = PLACEHOLDER_CATEGORY_SELECTED_TEXT;
    }
  }

  private _handleEscapeChanges(): void {
    this._escapeKeySubscription = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(filter((event) => event.code === 'Escape'))
      .subscribe((event) => {
        this._searchAreaService.mobileFilterShowed = false;
        this._searchAreaService.closeOverlay(this._searchAreaService.panelSearchFilterName);
      });
  }

  private _handleResizeChanges(): void {
    this._resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(this._searchAreaService.debounceTime))
      .subscribe((evt: any) => {
        if (this._searchAreaService.screenWidthGreaterThan(SCREEN_WIDTH_BREAKPOINT)) {
          this._searchAreaService.closeOverlay(this._searchAreaService.panelSearchFilterName);
          this._searchFilterComponentInstanceSubscription?.unsubscribe();
        }
        if (this._searchAreaService.screenWidthLessThan(SCREEN_WIDTH_BREAKPOINT)) {
          if (!this._searchAreaService.isOverlayAttached() && this._searchAreaService.mobileFilterShowed) {
            this._openOverlayedSearchFilterComponent();
          }
        }
      });
  }

  private _openOverlayedSearchFilterComponent() {
    const cfg = new OverlayConfig({
      panelClass: this._searchAreaService.panelSearchFilterName,
      scrollStrategy: this._overlay.scrollStrategies.block(),
    });
    this._searchAreaService.openOverlay(SearchFilterComponent, cfg, null, this._injector);
  }

  private _handleKeyUpChange(): void {
    this._keyUpChangeSubscription = this.keyUpChange$
      .pipe(
        filter((event) => {
          return !this._searchAreaService.areSuggestionsEnabled ? (event.key === 'Enter') : true;
        }),
      )
      .subscribe((event: KeyboardEvent) => {
        this._onKeyUp(event);
      });
  }

  private _handleActiveResultsItemChange(): void {
    this._activeResultsItemChangeSubscription = this.activeResultsItemChange$.subscribe((res: { text: string; type: string }) => {
      this._setActiveText(res);
    });
  }

  private _handleFocusQueryChanges(): void {
    this._focusQuerySubscription = combineLatest([this.focusChange$, this.debouncedQueryChange$])
      .pipe(
        map(([isFocused]) => {
          const query = this.form.get('query').value;
          this._searchAreaService.showSpinner();
          if (!isFocused) {
            this._searchAreaService.suggestionsType = null;
          }
          if (isFocused && query.length < this.minQueryLength) {
            this._searchAreaService.suggestionsType = 'history';
          }
          if (isFocused && query.length >= this.minQueryLength) {
            this._searchAreaService.suggestionsType = 'products';
          }
          return [this._searchAreaService.suggestionsType, query];
        }),
        switchMap(([suggestionType, query]) => {
          return defer(() => {
            if (suggestionType === 'history') {
              this._searchAreaService.updateHistoricalQueries();
              return of(true);
            }
            if (suggestionType === 'products') {
              return this._searchAreaService.updateQueries(query).pipe(
                map(() => of(true)),
                catchError((err) => {
                  this._searchAreaService.suggestionsType = null;
                  return of(null);
                }),
              );
            }
          });
        }),
      )
      .subscribe(() => {
        this._searchAreaService.hideSpinner();
      });
  }

  private _handleCategoryIdChanges(): void {
    this._categoryIdSubscription = this.form.get('categoryId').valueChanges.subscribe((res) => {
      this.placeholder = res ? PLACEHOLDER_CATEGORY_SELECTED_TEXT : PLACEHOLDER_DEFAULT_TEXT;
    });
  }

  submit(): void {
    this._searchAreaService.submitBoxChanges$.next('box');
  }

  handleFilterBtnClick(): void {
    if (this._searchAreaService.screenWidthGreaterThan(SCREEN_WIDTH_BREAKPOINT)) {
      this._searchAreaService.filterCollapsed = !this._searchAreaService.filterCollapsed;
    } else {
      this._searchAreaService.mobileFilterShowed = true;
      this._openOverlayedSearchFilterComponent();
    }
  }

  private _setActiveText(res: { text: string; type: string }): void {
    this.form.patchValue({ query: res.text }, { emitEvent: false, onlySelf: true });
    if (res.type === 'searchQueryHistory') {
      this._searchAreaService.isActiveResultsItemTypeHistorical = true;
    }
    if (res.type !== 'searchQueryHistory') {
      this._searchAreaService.isActiveResultsItemTypeHistorical = false;
    }
    this._cdr.detectChanges();
  }

  private _onKeyUp(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        this._searchAreaService.isActiveResultsItemTypeHistorical = false;
        if (this.form.valid) {
          this._searchAreaService.suggestionsType = null;
          this.submit();
        }
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        this._searchAreaService.upDownKeyboardInputCtrlEvent$.next(event);
        break;
      default:
        this._searchAreaService.isActiveResultsItemTypeHistorical = false;
        break;
    }
    this._cdr.detectChanges();
  }
}
