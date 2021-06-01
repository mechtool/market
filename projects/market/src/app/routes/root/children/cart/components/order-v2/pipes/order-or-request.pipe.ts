import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'marketOrderOrRequest',
})
export class OrderOrRequestPipe implements PipeTransform {
  transform(isOrderType: boolean): string {
    return isOrderType ? 'Данные для заказа' : 'Данные для запроса цен';
  }
}

