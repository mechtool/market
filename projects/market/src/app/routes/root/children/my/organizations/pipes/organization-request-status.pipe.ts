import { Pipe, PipeTransform } from '@angular/core';

const STATUS_CONVERTER =  {
  PENDING: 'Запрос отправлен',
  ACCEPTED: 'Запрос принят',
  REJECTED: 'Запрос отклонен',
};

@Pipe({
  name: 'marketOrganizationRequestStatus',
})
export class OrganizationRequestStatusPipe implements PipeTransform {
  transform(value: string): string {
    return STATUS_CONVERTER?.[value] || 'Запрос отправлен';
  }
}

