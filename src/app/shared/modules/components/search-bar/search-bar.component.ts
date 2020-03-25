import { Component, OnDestroy, OnInit, OnChanges, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, switchMap, takeUntil, map } from 'rxjs/operators';
import { LocalStorageService, ResponsiveService, SuggestionService } from '../../common-services';
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
  @Input() availableFilters: any;
  @Input() useBrowserStorage = true;
  @Output() queryChange: EventEmitter<any> = new EventEmitter();
  @Output() submitClick: EventEmitter<any> = new EventEmitter();

  get searchQuery() {
    return this.form.get('query').value;
  }

  constructor(
    private _responsiveService: ResponsiveService,
    private _fb: FormBuilder,
  ) {
    this._initForm();
    this._subscribeOnQueryChanges();
  }

  ngOnInit() {}

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
    const query = this.form.get('query').value;
    if (query.length >= this.MIN_QUERY_LENGTH) {
      this.submitClick.emit(query);
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
    this.form = this._fb.group({
      query: ['', [Validators.required, Validators.minLength(this.MIN_QUERY_LENGTH)]],
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
