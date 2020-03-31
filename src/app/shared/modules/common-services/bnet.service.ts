import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '#environments/environment';
import { generateQueryStringFromObject } from '#shared/utils';
import {
  NomenclaturesSearchQueryModel,
  NomenclaturesListResponseModel,
  SuggestionModel,
  UserOrganizationModel,
} from './models';

const API_URL = environment.apiUrl;

@Injectable()
export class BNetService {

  constructor(private _apiService: ApiService) { }

  searchNomenclatures(searchQuery: NomenclaturesSearchQueryModel): Observable<NomenclaturesListResponseModel> {
    return this._apiService.get(`${API_URL}/nomenclatures/search?${generateQueryStringFromObject(searchQuery)}`);
  }

  searchSuggestions(textQuery: string): Observable<SuggestionModel> {
    return this._apiService.get(`${API_URL}/suggestions/search?textQuery=${textQuery}`);
  }

  getUserOrganizations(): Observable<UserOrganizationModel[]> {
    return this._apiService.get(`${API_URL}/organizations/user-organizations`);
  }
}
