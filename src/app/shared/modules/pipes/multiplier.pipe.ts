import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myMultiplier',
})
export class MultiplierPipe implements PipeTransform {
  transform(value: number, multiply: string): number {
    return value * parseFloat(multiply);
  }
}
