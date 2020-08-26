import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocationModel, CountryCode } from './models';
import { BNetService } from './bnet.service';

@Injectable()
export class LocationService {

  constructor(private _bnetService: BNetService) {}

  searchLocations(textQuery: string): Observable<LocationModel[]> {
    if (textQuery.length) {
      return this._bnetService.searchLocations(textQuery);
    }
    return of(null);
  }

  searchAddresses(textQuery: string, deliveryZones?: {
    fiasCode: string;
    title: string;
    countryOksmCode: string;
  }[]): Observable<LocationModel[]> {


    if (!textQuery.length) {

      if (deliveryZones?.length) {
        return of(deliveryZones.map((zone) => {
          return {
            fias: zone.fiasCode,
            name: zone.title,
            fullName: zone.title,
          };
        }));
      }

      if (!deliveryZones?.length) {
        return this.getMainRegions();
      }
    }

    if (textQuery.length) {

      const textQueryArraySplittedByComma = textQuery.split(',');
      if (textQueryArraySplittedByComma.length === 1) {
        const newTextQuery = textQuery.split(' ').join(',');
        if (deliveryZones?.length) {
          return this._bnetService.searchAddresses(newTextQuery, deliveryZones.map(zone => zone.fiasCode));
        }
        if (!deliveryZones?.length) {
          return this._bnetService.searchAddresses(newTextQuery);
        }
      }
      if (textQueryArraySplittedByComma.length === 2 && !textQueryArraySplittedByComma[1].trim()) {
        if (deliveryZones?.length) {
          return this._bnetService.searchAddresses(textQuery, deliveryZones.map(zone => zone.fiasCode));
        }
        if (!deliveryZones?.length) {
          return this._bnetService.searchAddresses(textQuery);
        }
      }
      if (textQueryArraySplittedByComma.length >= 2 && textQueryArraySplittedByComma[1].trim()) {
        const firstPartArraySplittedByComma = textQueryArraySplittedByComma.slice(0, textQueryArraySplittedByComma.length - 1);
        const lastElem = textQueryArraySplittedByComma[textQueryArraySplittedByComma.length - 1];
        const textLastElem = lastElem.split(' ').join(',');
        if (deliveryZones?.length) {
          return this._bnetService.searchAddresses(
            firstPartArraySplittedByComma.join(',') + textLastElem,
            deliveryZones.map(zone => zone.fiasCode)
          );
        }
        if (!deliveryZones?.length) {
          return this._bnetService.searchAddresses(
            firstPartArraySplittedByComma.join(',') + textLastElem
          );
        }
      }

    }
  }

  getMainRegions(): Observable<LocationModel[]> {
    return this._bnetService.getMainRegions();
  }

}
