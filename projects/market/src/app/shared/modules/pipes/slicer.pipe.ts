import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketSlicer',
})
export class SlicerPipe implements PipeTransform {
  transform(value: any[], start = 0, end?: number): any[] {
    if (value == null || !this._supports(value)) {
      return null;
    }
    return value.slice(start, end || value.length);
  }

  private _supports(obj: any): boolean {
    return typeof obj === 'string' || Array.isArray(obj);
  }
}
