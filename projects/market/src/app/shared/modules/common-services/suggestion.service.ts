import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { SuggestionResponseModel } from './models';
import { BNetService } from './bnet.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class SuggestionService {
  constructor(private _bnetService: BNetService, private localStorageService: LocalStorageService) {}

  searchSuggestions(query: string): Observable<SuggestionResponseModel> {
    return this._bnetService.searchSuggestions(query.length > 20 ? query.slice(0, 20) : query);
  }

  getHistoricalSuggestions(query?: string): Observable<SuggestionResponseModel> {
    return of(this.localStorageService.getSearchQueriesHistoryList(query));
  }
}
