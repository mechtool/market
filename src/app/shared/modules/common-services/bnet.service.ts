import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '#environments/environment';
import {
  LocationModel,
  NomenclatureOffersModel,
  NomenclaturesListResponseModel,
  NomenclaturesSearchQueryModel,
  OfferFilterQueryModel,
  SuggestionModel,
  UserOrganizationModel,
} from './models';
import { HttpParams } from '@angular/common/http';

const API_URL = environment.apiUrl;

@Injectable()
export class BNetService {

  constructor(private _apiService: ApiService) {
  }

  getNomenclature(id: string, filterQuery?: OfferFilterQueryModel): Observable<NomenclatureOffersModel> {
    const params = this._params(filterQuery);
    return this._apiService.get(`${API_URL}/nomenclatures/${id}`, { params });
  }

  searchNomenclatures(searchQuery: NomenclaturesSearchQueryModel): Observable<NomenclaturesListResponseModel> {
    const params = this._params(searchQuery);
    return this._apiService.get(`${API_URL}/nomenclatures/search`, { params });
  }

  searchSuggestions(query: string): Observable<SuggestionModel> {
    const params = new HttpParams().set('q', query);
    return this._apiService.get(`${API_URL}/suggestions`, { params });
  }


  getUserOrganizations(): Observable<UserOrganizationModel[]> {
    return this._apiService.get(`${API_URL}/organizations/user-organizations`);
  }

  searchLocations(textQuery: string): Observable<LocationModel[]> {
    const params = new HttpParams().set('textQuery', textQuery);
    return this._apiService.get(`${API_URL}/locations/search`, { params });
  }

  _params(searchQuery: any): HttpParams {
    if (searchQuery) {
      let params = new HttpParams();
      Object.keys(searchQuery).forEach((queryParam) => {
        if (searchQuery[queryParam]?.toString()) {
          params = params.append(queryParam, searchQuery[queryParam]);
        }
      });
      return params;
    }
  }
}

