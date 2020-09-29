import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketArrayJoiner',
})
export class ArrayJoinerPipe implements PipeTransform {
  transform(input: any[], prop?: string, sep = ', '): string {
    const arr = prop && input?.length ? input.map((el) => el[prop]) : input;
    return arr?.join(sep);
  }
}
