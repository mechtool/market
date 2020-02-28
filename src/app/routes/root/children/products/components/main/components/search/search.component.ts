import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { ResponsiveService } from '#shared/modules';
import { ProductsService } from './../../../../services';
import { SuggestResponseItemProductModel, SuggestResponseItemCategoryModel } from './../../../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'c-main-search',
  templateUrl: './search.component.html',
  styleUrls: [
    './search.component.scss',
    './search.component-576.scss',
  ],
})
export class MainSearchComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  form: FormGroup;
  isInputHovered = false;
  isInputFocused = false;
  quickSearchOver = false;
  productsSuggestions: SuggestResponseItemProductModel[];
  categoriesSuggestions: SuggestResponseItemCategoryModel[];

  get searchQuery() {
    return this.form.get('query').value;
  }

  constructor(
    private _router: Router,
    private _productsService: ProductsService,
    private _responsiveService: ResponsiveService,
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    this._initForm();
    this.form.get('query').valueChanges
      .pipe(
        takeUntil(this._unsubscriber$),
        switchMap((res) => {
          return this._productsService.getSuggestions(res);
        })
      )
      .subscribe((res) => {
        this.productsSuggestions  = res.products;
        this.categoriesSuggestions  = res.categories;
      });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  submit() {
    const query = this.form.get('query').value;
    if (query.length >= 3) {
      this._router.navigate(['/search'], {
        queryParams: {
          query: this.form.get('query').value,
        }
      });
    }
  }

  screenWidthGreaterThan(val: number) {
    return this._responsiveService.screenWidthGreaterThan(val);
  }

  private _initForm(): void {
    this.form = this._fb.group({
      query: [''],
    });
  }


}
