import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketAvailableQuantityProducts',
})
export class AvailableQuantityProductsPipe implements PipeTransform {
  transform(isNotAvailable: boolean, stockAmount: number, unitOkei: string): string {
    if (isNotAvailable) {
      return 'Недоступно';
    }
    if (stockAmount) {
      return `${stockAmount} ${unitOkei || 'шт.'}`
    }
    return 'Доступно';
  }
}
