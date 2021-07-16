import { Pipe, PipeTransform } from '@angular/core';
import { PriceListStatusEnum } from '#shared/modules/common-services/models';

@Pipe({
  name: 'priceListStatusMessage',
})
export class PriceListStatusMessagePipe implements PipeTransform {

  transform(value: PriceListStatusEnum, message: string): string {
    switch (value) {
      case PriceListStatusEnum.Completed:
        return `Процесс обновления прайс-листа завершен.`;
      case PriceListStatusEnum.InProgress:
        return 'Запущен процесс обновления торговых предложений. Операции с прайс-листом станут доступны после завершения процесса.';
      case PriceListStatusEnum.Failed:
        if (message.includes('Внутренняя ошибка')) {
          return `${message}. Для завершения процесса публикации, попробуйте позднее перезапустить процесс обновления прайс-листа.`;
        }
        return `${message}. Для завершения процесса публикации - исправте указанную ошибку и перезапустите процесс обновления прайс-листа.`;
      default:
        return ''
    }
  }
}
