import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import {
  LocalStorageService,
  SuggestionSearchQueryHistoryModel,
  SuggestionService,
  TypeOfSearch
} from '../../../../common-services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'my-search-bar-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarHistoryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() query: string;
  private _unsubscriber$: Subject<any> = new Subject();
  searchQueriesHistory: SuggestionSearchQueryHistoryModel[];

  constructor(
    private _suggestionService: SuggestionService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit() {
    this._initHistoricalSuggestions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._initHistoricalSuggestions();
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
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
        (res) => {
          const suggestion = res[0];
          const queryParams = res[1];
          this.searchQueriesHistory = suggestion.searchQueriesHistory.filter(history => history.searchText !== queryParams.q);
        },
        (err) => {
          console.error('error', err);
        }
      );
  }
}
