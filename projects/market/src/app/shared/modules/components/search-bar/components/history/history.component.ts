import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { combineLatest } from 'rxjs';
import {
  LocalStorageService,
  NotificationsService,
  SuggestionService,
  TypeOfSearch,
} from '#shared/modules/common-services';
import { SuggestionSearchQueryHistoryModel, } from '#shared/modules/common-services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'my-search-bar-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarHistoryComponent implements OnInit, OnChanges {
  @Input() query: string;
  searchQueriesHistory: SuggestionSearchQueryHistoryModel[];

  constructor(
    private _suggestionService: SuggestionService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _localStorageService: LocalStorageService,
    private _notificationsService: NotificationsService,
  ) {
  }

  ngOnInit() {
    this._initHistoricalSuggestions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._initHistoricalSuggestions();
  }

  clickSearchQuery(searchQuery: SuggestionSearchQueryHistoryModel) {
    this._localStorageService.putSearchQuery(searchQuery);
    if (searchQuery.typeOfSearch === TypeOfSearch.PRODUCT) {

      this._router.navigate([`./product/${searchQuery.id}`]);

    } else if (searchQuery.typeOfSearch === TypeOfSearch.CATEGORY) {

      this._router.navigate([`./category/${searchQuery.id}`]);

    } else if (searchQuery.typeOfSearch === TypeOfSearch.SEARCH) {
      // todo: нужно ли при щелчке по элементу выпавшего списка подсказок передавать еще что-то из других фильтров
      this._router.navigate([`./search`], { queryParams: { q: searchQuery.searchText } });

    }
  }

  cleanHistory(id: string) {
    this._localStorageService.removeSearchQuery(id);
    this._initHistoricalSuggestions();
  }

  private _initHistoricalSuggestions(): void {
    combineLatest([
      this._suggestionService.getHistoricalSuggestions(this.query),
      this._activatedRoute.queryParams
    ])
      .subscribe(
        ([suggestions, queryParams]) => {
          this.searchQueriesHistory = suggestions.searchQueriesHistory.filter(history => history.searchText !== queryParams.q);
        },
        (err) => {
          this._notificationsService.error('Невозможно обработать запрос. Внутренняя ошибка сервера.');
        }
      );
  }
}
