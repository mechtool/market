import { Pipe, PipeTransform } from '@angular/core';

const STATUS_CONVERTER =  {
  Issued: 'Доступен',
  Activated: 'Активирован',
  Revoked: 'Отозван',
};

@Pipe({
  name: 'marketAccessKeyStatus',
})
export class AccessKeyStatusPipe implements PipeTransform {
  transform(value: string): string {
    return STATUS_CONVERTER?.[value] || 'Доступен';
  }
}

