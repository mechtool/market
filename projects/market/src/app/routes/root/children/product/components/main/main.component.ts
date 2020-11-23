import { Component, OnInit } from '@angular/core';
import { AllGroupQueryFiltersModel, SuggestionCategoryItemModel, SuggestionProductItemModel } from '#shared/modules/common-services/models';
import { Router } from '@angular/router';
import { queryParamsFrom } from '#shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ExternalProvidersService, LocalStorageService, NotificationsService, SuggestionService } from '#shared/modules/common-services';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'market-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss', './main.component-768.scss'],
})
export class MainComponent implements OnInit {
  productsSuggestions: SuggestionProductItemModel[];
  categoriesSuggestions: SuggestionCategoryItemModel[];

  constructor(
    private _router: Router,
    private _suggestionService: SuggestionService,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
    private _externalProvidersService: ExternalProvidersService,
  ) {}

  ngOnInit() {
    const tag = {
      event: 'HomePage',
    };
    this._externalProvidersService.fireGTMEvent(tag);
  }

  searchSuggestions(query: string) {
    this._suggestionService.searchSuggestions(query).subscribe(
      (res) => {
        this.productsSuggestions = res.products;
        this.categoriesSuggestions = res.categories;
      },
      (err) => {
        this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
      },
    );
  }

  navigateToSearchRoute(filters: AllGroupQueryFiltersModel) {
    this._localStorageService.putSearchText(filters.query);
    this._router.navigate(['/search'], {
      queryParams: queryParamsFrom(filters),
    });
  }
}
