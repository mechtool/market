import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketNaviCounter',
})
export class NaviCounterPipe implements PipeTransform {
  transform(value: number, maxValue: number = 99, replacingText: string = '99+'): string | number {
    return value ? value <= maxValue ? value : replacingText : null;
  }
}

