import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketHiddenSymbols',
})
export class HiddenSymbolsPipe implements PipeTransform {
  transform(value: string, openChars = 3): string {
    if (value && value.length > openChars) {

      const array = value.split('');

      for (let i = openChars; i < value.length; i++) {
        if (array[i] !== '@' && array[i] !== '-' && array[i] !== ' ' && array[i] !== '(' && array[i] !== ')' && array[i] !== '.') {
          array[i] = 'x';
        }
      }
      return array.join('');
    }
    return value;
  }
}
