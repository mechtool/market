import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {
  LocalStorageService,
  SuggestionSearchQueryHistoryItemModel,
  SuggestionService,
  TypeOfSearch
} from '../../../../common-services';
import { Router } from '@angular/router';

@Component({
  selector: 'my-search-bar-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarHistoryComponent implements OnInit, OnDestroy {
  private _unsubscriber$: Subject<any> = new Subject();
  searchQueriesHistory: SuggestionSearchQueryHistoryItemModel[];

  constructor(
    private _suggestionService: SuggestionService,
    private _router: Router,
    private _localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit() {
    this._suggestionService.getHistoricalSuggestions()
      .subscribe((res) => {
        this.searchQueriesHistory = res.searchQueriesHistory;
      }, (err) => {
        console.log('error', err);
      });
  }

  ngOnDestroy() {
    this._unsubscriber$.next();
    this._unsubscriber$.complete();
  }

  clickSearchQuery(searchQuery: SuggestionSearchQueryHistoryItemModel) {
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
}
