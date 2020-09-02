import { Pipe, PipeTransform } from '@angular/core';

export const MAX_VALUE = 1000;

@Pipe({
  name: 'marketFound',
})
export class FoundPipe implements PipeTransform {
  transform(value: number): string {
    return value < MAX_VALUE ? 'найдено' : 'найдено более';
  }
}
