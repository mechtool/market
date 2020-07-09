import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import {
  AllGroupQueryFiltersModel,
  SuggestionCategoryItemModel,
  SuggestionProductItemModel,
} from '#shared/modules/common-services/models';
import { LocalStorageService, SuggestionService } from '#shared/modules/common-services';
import { Router } from '@angular/router';
import { BreadcrumbsService } from '../../../../components/breadcrumbs/breadcrumbs.service';
import { queryParamsFrom } from '#shared/utils';

@Component({
  selector: 'my-main',
  templateUrl: './main.component.html',
  styleUrls: [
    './main.component.scss',
    './main.component-768.scss'
  ],
})
export class MainComponent implements OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  productsSuggestions: SuggestionProductItemModel[];
  categoriesSuggestions: SuggestionCategoryItemModel[];

  constructor(
    private _router: Router,
    private _suggestionService: SuggestionService,
    private _localStorageService: LocalStorageService,
    private _breadcrumbsService: BreadcrumbsService,
  ) {
    this._breadcrumbsService.setVisible(false);
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  searchSuggestions(query: string) {
    this._suggestionService.searchSuggestions(query)
      .subscribe((res) => {
        this.productsSuggestions = res.products;
        this.categoriesSuggestions = res.categories;
      }, (err) => {
        console.error('error', err);
      });
  }

  navigateToSearchRoute(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    this._router.navigate(['/search'], {
      queryParams: queryParamsFrom(filters),
    });
  }
}
