import { Pipe, PipeTransform } from '@angular/core';
import { PriceListStatusEnum } from '#shared/modules/common-services/models';

@Pipe({
  name: 'priceListStatusMessage',
})
export class PriceListStatusMessagePipe implements PipeTransform {

  transform(value: PriceListStatusEnum): string {
    switch (value) {
      case PriceListStatusEnum.Completed:
      case PriceListStatusEnum.COMPLETED:
        return `Процесс обновления прайс-листа завершен.`;
      case PriceListStatusEnum.InProgress:
      case PriceListStatusEnum.IN_PROGRESS:
        return 'Запущен процесс обновления торговых предложений. Операции с прайс-листом станут доступны после завершения процесса.';
      case PriceListStatusEnum.FailedNoValidPositions:
        return 'Прайс-лист не был загружен по причине того, что в excel файле нет корректно заполненных позиций.';
      case PriceListStatusEnum.FailedInvalidFileUrl:
        return 'Прайс-лист не был загружен по причине того, что не удалось скачать excel файл по указанному URL-адресу.';
      case PriceListStatusEnum.FailedInvalidFileFormat:
        return 'Прайс-лист не был загружен по причине того, что по указанному URL-адресу расположен файл в неверном формате.';
      default:
        return ''
    }
  }
}
