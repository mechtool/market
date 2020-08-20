import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketNaviCartCounter',
})
export class NaviCartCounterPipe implements PipeTransform {
  transform(value: number, maxValue: number = 999, replacingText: string = '...'): string | number {
    return value ? value < maxValue ? value : replacingText : null;
  }
}

