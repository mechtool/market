import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Level, LocationModel } from './models';
import { BNetService } from './bnet.service';

@Injectable()
export class LocationService {

  constructor(private _bnetService: BNetService) {
  }

  searchLocations(textQuery: string, level: Level): Observable<LocationModel[]> {
    if (textQuery.length) {
      return this._bnetService.searchLocations(textQuery, level);
    }
    return of(null);
  }

  searchAddresses(query: {
                    deliveryCity: string,
                    deliveryStreet?: string,
                    deliveryHouse?: string
                  },
                  level: Level): Observable<LocationModel[]> {
    let textQuery = query.deliveryCity;

    if (query.deliveryStreet?.length) {
      textQuery = `${textQuery}, ${query.deliveryStreet}`;
    }

    if (query.deliveryHouse?.length) {
      textQuery = `${textQuery}, ${query.deliveryHouse}`;
    }

    return this._bnetService.searchLocations(textQuery, level);
  }

  isDeliveryAvailable(searchFiasElement: string, fiasElements: string[]): Observable<boolean> {
    return this._bnetService.containsFiasAddress({ fiasId: searchFiasElement, fiasIds: fiasElements});
  }
}
