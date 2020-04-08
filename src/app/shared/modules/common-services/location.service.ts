import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationModel } from './models';
import { BNetService } from './bnet.service';

@Injectable()
export class LocationService {

  constructor(private _bnetService: BNetService) {}

  searchLocations(textQuery: string): Observable<LocationModel[]> {
    return this._bnetService.searchLocations(textQuery);
  }

}
