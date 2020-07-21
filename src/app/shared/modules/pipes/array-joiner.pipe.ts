import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myArrayJoiner',
})
export class ArrayJoinerPipe implements PipeTransform {
  transform(input: Array<any>, prop?: string, sep = ', '): string {
    const arr = prop && input?.length ? input.map(el => el[prop]) : input;
    return arr?.join(sep);
  }
}
