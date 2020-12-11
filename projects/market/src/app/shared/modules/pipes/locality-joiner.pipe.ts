import { Pipe, PipeTransform } from '@angular/core';
import { CountryCode, TradeOfferRegionsModel } from '#shared/modules/common-services/models';

@Pipe({
  name: 'marketLocalityJoiner',
})
export class LocalityJoinerPipe implements PipeTransform {
  transform(locality: TradeOfferRegionsModel[], isPickup = false): string {
    if (!locality || !locality?.length ||
      locality.some((place) => !place.fiasCodes?.length && place.countryOksmCode === CountryCode.RUSSIA)) {
      return isPickup ? null : 'По всей России';
    }
    const names = locality.map((place) => place.name || place.address)
      .filter((value, index, self) => self.indexOf(value) === index);

    return names?.join('; ');
  }
}
