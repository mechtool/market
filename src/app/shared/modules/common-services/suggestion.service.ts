import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { SuggestionModel } from './models';
import { BNetService } from './bnet.service';
import { LocalStorageService } from './local.storage.service';

@Injectable()
export class SuggestionService {

  constructor(private _bnetService: BNetService,
              private localStorageService: LocalStorageService) {
  }

  searchSuggestions(textQuery: string): Observable<SuggestionModel> {
    return this._bnetService.searchSuggestions(textQuery);
  }

  getHistoricalSuggestions(): Observable<SuggestionModel> {
    return of(this.localStorageService.getSearchQueriesHistoryList());
  }

}
