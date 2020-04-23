import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '#environments/environment';
import {
  LocationModel,
  NomenclatureModel,
  NomenclaturesListResponseModel,
  NomenclaturesSearchQueryModel,
  SuggestionModel,
  UserOrganizationModel,
} from './models';
import { HttpParams } from '@angular/common/http';

const API_URL = environment.apiUrl;

@Injectable()
export class BNetService {

  constructor(private _apiService: ApiService) {
  }

  getNomenclature(nomenclatureId: string): Observable<NomenclatureModel> {
    // return this._apiService.get(`${API_URL}/nomenclature/:id`, { params });
    // todo Переделать, когда появится реализация
    return of({
      id: nomenclatureId,
      productName: 'Вода BON AQUA минеральная столовая/питьевая газированная, 24х0,5л',
      imageUrls: [
        'assets/img/tmp/bon_aqua_1.jpg',
        'assets/img/tmp/bon_aqua_2.jpg',
        'assets/img/tmp/bon_aqua_3.jpg',
        'assets/img/tmp/bon_aqua_4.jpg'
      ],
      offersSummary: {
        minPrice: 1000,
        totalOffers: 10,
      },

      categoryId: '5974',
      categoryName: 'Вода другое',
      categoryParentsIds: ['3321', '874', '985', '5974'],
      productDescription: 'Основной ионный состав: кальций 25-60мг/л, магний 5-35мг/л, калий 2-20мг/л, ' +
        'бикарбонаты 30-300мг/л, хлориды 150мг/л, сульфаты 150мг/л, фторид-ион 1мг/л ' +
        'Хранить при температуре от +2°С до + 25°С относительной влажности не более 85% без прямого воздействия солнечного света ' +
        'После вскрытия бутылки рекомендуется хранить воду в холодильнике и использовать в течение 3 суток ' +
        'Проконсультируйтесь со специалистом. Срок хранения: 6 месяцев',
      productPartNumber: '464843',
      productBarCodes: ['40822426', '40822427'],
      features: [], // NomenclatureFeatureModel
      manufacturer: {
        name: 'Coca-Cola',
        tradeMark: 'BON AQUA',
      },
    });
  }

  searchNomenclatures(searchQuery: NomenclaturesSearchQueryModel): Observable<NomenclaturesListResponseModel> {
    let params = new HttpParams();
    Object.keys(searchQuery).forEach((queryParam) => {
      if (searchQuery[queryParam]?.toString()) {
        params = params.append(queryParam, searchQuery[queryParam]);
      }
    });
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
}

