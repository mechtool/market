import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'documentStatus',
})
export class DocumentStatusPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(type: string, sentDate: number, receivedDate: number): string {
    switch (type) {
      case 'SENT':
        return `Отправлен ${this.datePipe.transform(sentDate, 'dd.MM.yyyy в HH:mm')}`;
      case 'DELIVERED':
        return `Получен ${this.datePipe.transform(receivedDate, 'dd.MM.yyyy в HH:mm')}`;
      case 'REJECTED':
        return 'Отклонён';
    }
  }
}
