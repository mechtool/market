import { Pipe, PipeTransform } from '@angular/core';
import { PriceListStatusEnum } from '#shared/modules/common-services/models';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'priceListStatus',
})
export class PriceListStatusPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(value: PriceListStatusEnum, date: string, message: string): string {
    switch (value) {
      case PriceListStatusEnum.Completed:
        return `Обновлен ${this.datePipe.transform(date, 'dd.MM.yyyy в HH:mm')}`;
      case PriceListStatusEnum.InProgress:
        return 'Обновляется';
      case PriceListStatusEnum.Failed:
        return message;
      default:
        return 'Требуется запустить обновление'
    }
  }
}
