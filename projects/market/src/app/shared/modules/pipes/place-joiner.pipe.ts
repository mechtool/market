import { Pipe, PipeTransform } from '@angular/core';
import { CountryCode } from '#shared/modules/common-services/models';

@Pipe({
  name: 'marketPlaceJoiner',
})
export class PlaceJoinerPipe implements PipeTransform {
  transform(zone: { fiasCode: string; title: string; countryOksmCode: string; }[], isPickup = false): string {
    if (!zone || !zone?.length || zone.some((place) => !place.fiasCode && place.countryOksmCode === CountryCode.RUSSIA)) {
      return isPickup ? null : 'По всей России';
    }
    const deliveries = zone.map((place) => place.title).filter((value, index, self) => self.indexOf(value) === index);
    return deliveries?.join('; ');
  }
}
