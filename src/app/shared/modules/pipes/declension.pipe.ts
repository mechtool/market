import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myDeclension',
})
export class DeclensionPipe implements PipeTransform {
  transform(value: number, ...args: string[]): string {
    // tslint:disable-next-line:max-line-length
    return args[(value % 10 === 1 && value % 100 !== 11) ? 0 : value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20) ? 1 : 2];
  }
}
