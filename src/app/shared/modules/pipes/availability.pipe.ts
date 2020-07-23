import { Pipe, PipeTransform } from '@angular/core';

const  AVAILABILITY_CONVERTER =  {
  NoOfferAvailable: 'Нет в наличии',
  TemporarilyOutOfSales: 'Временно снят с продажи',
  AvailableForOrder: 'На складе',
};

@Pipe({
  name: 'myAvailability',
})
export class AvailabilityPipe implements PipeTransform {
  transform(value: string): string {
    return AVAILABILITY_CONVERTER?.[value] || 'Нет в наличии';
  }
}

