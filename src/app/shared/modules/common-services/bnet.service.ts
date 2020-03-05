import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '#environments/environment';
import { concatUrlQueryParamsObject } from '#shared/utils';
import {
  NomenclaturesSearchQueryModel,
  NomenclaturesListResponseModel,
  SuggestionModel
} from './models';

const API_URL = environment.apiUrl;

@Injectable()
export class BNetService {

  constructor(private _apiService: ApiService) { }

  searchNomenclatures(searchQuery?: NomenclaturesSearchQueryModel): Observable<NomenclaturesListResponseModel> {
    return this._apiService.get(concatUrlQueryParamsObject(`${API_URL}/nomenclatures/search`, searchQuery));
  }

  searchSuggestions(textQuery: string): Observable<SuggestionModel> {
    return this._apiService.get(`${API_URL}/suggestions/search?textQuery=${textQuery}`);
  }
}
