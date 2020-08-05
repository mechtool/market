import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketMultiplier',
})
export class MultiplierPipe implements PipeTransform {
  transform(value: number, multiply: string): number {
    return value * parseFloat(multiply);
  }
}
