import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'marketLog'})
export class LogPipe implements PipeTransform {
  public transform(value: object): void {
    console.log(value);
    return;
  }
}
