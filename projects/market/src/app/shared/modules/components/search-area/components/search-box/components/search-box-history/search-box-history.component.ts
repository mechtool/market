import { AfterViewInit, Component, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { NotificationsService, TypeOfSearch } from '#shared/modules/common-services';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { SearchBoxItemComponent } from '../search-box-item/search-box-item.component';
import { SearchAreaService } from '../../../../search-area.service';
import { filter, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { SearchItemHistoryModel, SearchResultsTitleEnumModel } from '../../../../models';

@Component({
  selector: 'market-search-box-history',
  templateUrl: './search-box-history.component.html',
  styleUrls: ['./search-box-history.component.scss'],
})
export class SearchBoxHistoryComponent implements AfterViewInit, OnDestroy {
  @ViewChildren(SearchBoxItemComponent) private _itemComponents: QueryList<SearchBoxItemComponent>;
  private _keyManager: ActiveDescendantKeyManager<SearchBoxItemComponent>;
  private _upDownKeyboardInputCtrlEventSubscription: Subscription;

  get upDownKeyboardInputCtrlEvent$() {
    return this._searchAreaService.upDownKeyboardInputCtrlEvent$.pipe(filter((res) => res));
  }

  get historicalQueries$(): Observable<SearchItemHistoryModel[]> {
    return this._searchAreaService.historicalQueries$.pipe(
      tap((res) => {
        this._searchAreaService.resultsTitle = res?.length ? SearchResultsTitleEnumModel.HISTORY : null;
      }),
    );
  }

  constructor(private _searchAreaService: SearchAreaService, private _router: Router, private _activatedRoute: ActivatedRoute) {}

  ngAfterViewInit() {
    this._keyManager = new ActiveDescendantKeyManager(this._itemComponents).withWrap();
    this._upDownKeyboardInputCtrlEventSubscription = this.upDownKeyboardInputCtrlEvent$.subscribe((res) => {
      this._keyManager.onKeydown(res);
    });
  }

  ngOnDestroy() {
    this._keyManager = null;
    this._itemComponents = null;
    this._upDownKeyboardInputCtrlEventSubscription.unsubscribe();
  }

  clickSearchQuery(searchQuery: SearchItemHistoryModel) {
    this._searchAreaService.putSearchQueryToBrowser(searchQuery);
    if (searchQuery.typeOfSearch === TypeOfSearch.PRODUCT) {
      this._router.navigate([`./product/${searchQuery.id}`]);
    } else if (searchQuery.typeOfSearch === TypeOfSearch.CATEGORY) {
      this._router.navigate([`./category/${searchQuery.id}`]);
    } else if (searchQuery.typeOfSearch === TypeOfSearch.SEARCH) {
      this._router.navigate([`./category`], { queryParams: { q: searchQuery.searchText } });
    }
  }

  removeHistoricalSuggestionById(id: string) {
    this._searchAreaService.removeSearchQueryFromBrowser(id);
    this._searchAreaService.updateHistoricalQueries();
  }
}
