import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '#environments/environment';
import {
  NomenclaturesSearchQueryModel,
  NomenclaturesListResponseModel,
  SuggestionModel,
  UserOrganizationModel,
  LocationModel,
} from './models';
import { HttpParams } from '@angular/common/http';

const API_URL = environment.apiUrl;

@Injectable()
export class BNetService {

  constructor(private _apiService: ApiService) { }

  searchNomenclatures(searchQuery: NomenclaturesSearchQueryModel): Observable<NomenclaturesListResponseModel> {
    let params = new HttpParams();
    Object.keys(searchQuery).forEach((queryParam) => {
      if (searchQuery[queryParam]?.toString()) {
        params = params.append(queryParam, searchQuery[queryParam]);
      }
    });
    return this._apiService.get(`${API_URL}/nomenclatures/search`, { params });
  }

  searchSuggestions(textQuery: string): Observable<SuggestionModel> {
    const params = new HttpParams().set('textQuery', textQuery);
    return this._apiService.get(`${API_URL}/suggestions/search`, { params });
  }

  getUserOrganizations(): Observable<UserOrganizationModel[]> {
    return this._apiService.get(`${API_URL}/organizations/user-organizations`);
  }

  searchLocations(textQuery: string): Observable<LocationModel[]> {
    const params = new HttpParams().set('textQuery', textQuery);
    return this._apiService.get(`${API_URL}/locations/search`, { params });
  }
}

