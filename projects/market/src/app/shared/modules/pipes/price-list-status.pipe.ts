import { Pipe, PipeTransform } from '@angular/core';
import { PriceListStatusEnum } from '#shared/modules/common-services/models';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'priceListStatus',
})
export class PriceListStatusPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(value: PriceListStatusEnum, date: string): string {
    switch (value) {
      case PriceListStatusEnum.COMPLETED:
        return `Обновлен ${this.datePipe.transform(date, 'dd.MM.yyyy в HH:mm')}`;
      case PriceListStatusEnum.IN_PROGRESS:
        return 'Обновляется';
      default:
        return 'Требуется запустить обновление'
    }
  }
}
