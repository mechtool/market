import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationModel } from './models';
import { BNetService } from './bnet.service';

@Injectable()
export class LocationService {

  constructor(private _bnetService: BNetService) {}

  searchLocations(textQuery: string): Observable<LocationModel[]> {
    if (textQuery.length) {
      return this._bnetService.searchLocations(textQuery);
    }
    return null;
  }

  searchAddresses(textQuery: string, fiasIds: string[]): Observable<LocationModel[]> {
    if (textQuery.length) {
      return this._bnetService.searchAddresses(textQuery, fiasIds);
    }
    return null;
  }

}
