import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'marketOfferStatus',
})
export class OfferStatusPipe implements PipeTransform {

  constructor(private _datePipe: DatePipe) {
  }

  transform(statusEn: string, sentDate: number, receivedDate: number): string {
    switch (statusEn.toUpperCase()) {
      case 'SENT':
        return `Отправлено ${sentDate ? this._datePipe.transform(sentDate, 'dd.MM.yyyy в HH:mm') : ''}`.trim();
      case 'DELIVERED':
        return `Получено ${receivedDate ? this._datePipe.transform(receivedDate, 'dd.MM.yyyy в HH:mm') : ''}`.trim();
      case 'REJECTED':
        return 'Отклонено';
    }
  }

}
