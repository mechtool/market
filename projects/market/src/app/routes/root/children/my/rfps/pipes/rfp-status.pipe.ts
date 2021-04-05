import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

const statusObj = {
  CANCELLED: 'Отменен ',
  COMPLETED: 'Завершен ',
  ANALYSIS: 'Анализ предложений до ',
  COLLECTING: 'Cбор предложений до ',
  PREPARATION: 'Cбор предложений начнется ',
}

@Pipe({
  name: 'marketRfpStatus',
})
export class RfpStatusPipe implements PipeTransform {

  constructor(private _datePipe: DatePipe) {
  }

  transform(statusEn: string, statusDate: Date): string {
    return `${statusObj[statusEn.toUpperCase()]} ${this._datePipe.transform(statusDate, 'dd.MM.yyyy')}`
  }

}
