import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CountryCode, Level, LocationModel } from './models';
import { BNetService } from './bnet.service';
import { LocalStorageService } from '#shared/modules/common-services/local-storage.service';

@Injectable()
export class LocationService {

  constructor(
    private _bnetService: BNetService,
    private _localStorageService: LocalStorageService,
  ) {
  }

  getSelectedCustomLocation(): LocationModel {
    if (this._localStorageService.hasUserLocation()) {
      const userLocation = this._localStorageService.getUserLocation();
      if (userLocation.fias !== CountryCode.RUSSIA) {
        return userLocation;
      }
    }
    return null;
  }

  searchLocations(textQuery: string, level: Level): Observable<LocationModel[]> {
    if (textQuery.length) {
      return this._bnetService.searchLocations(textQuery, level);
    }
    return of(null);
  }

  searchAddresses(query: { deliveryRegion?: string, deliveryCity?: string, deliveryStreet?: string, deliveryHouse?: string },
                  level: Level): Observable<LocationModel[]> {
    const textQuery = Object.values(query).filter(res => res?.length).join(', ');
    return this._bnetService.searchLocations(textQuery, level);
  }

  isDeliveryAvailable(searchFiasElement: string, fiasElements: string[]): Observable<boolean> {
    return this._bnetService.containsFiasAddress({ fiasId: searchFiasElement, fiasIds: fiasElements });
  }
}
