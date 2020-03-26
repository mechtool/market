import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
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
export class SearchBarComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  form: FormGroup;
  isInputHovered = false;
  isInputFocused = false;
  quickSearchOver = false;
  productsSuggestions: SuggestionProductItemModel[];
  categoriesSuggestions: SuggestionCategoryItemModel[];
  MIN_QUERY_LENGTH = 3;

  get searchQuery() {
    return this.form.get('query').value;
  }

  constructor(
    private _router: Router,
    private _suggestionService: SuggestionService,
    private _responsiveService: ResponsiveService,
    private _fb: FormBuilder,
    private _localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit() {
    this._initForm();
    this.form.get('query').valueChanges
      .pipe(
        takeUntil(this._unsubscriber$),
        filter(res => res.length >= this.MIN_QUERY_LENGTH),
        switchMap((res) => {
          return this._suggestionService.searchSuggestions(res);
        })
      )
      .subscribe((res) => {
        this.productsSuggestions = res.products;
        this.categoriesSuggestions = res.categories;
      }, (err) => {
        console.log('error');
      });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  submit() {
    const query = this.form.get('query').value;
    if (query.length >= this.MIN_QUERY_LENGTH) {
      this._localStorageService.putSearchText(query);
      this._router.navigate(['/search'], {
        queryParams: {
          q: this.form.get('query').value,
        }
      });
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
}
