import { Pipe, PipeTransform } from '@angular/core';
import { CountryCode } from '#shared/modules/common-services/models';

@Pipe({
  name: 'marketPlaceJoiner',
})
export class PlaceJoinerPipe implements PipeTransform {
  transform(zone: { fiasCode: string; title: string; countryOksmCode: string; }[], sep = ', '): string {
    if (!zone || !zone?.length || zone.some((place) => !place.fiasCode && place.countryOksmCode === CountryCode.RUSSIA)) {
      return 'По всей России';
    }
    const deliveries = zone?.length ? zone.map((place) => place.title) : zone;
    return deliveries?.join(sep);
  }
}
