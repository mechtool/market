import { Pipe, PipeTransform } from '@angular/core';
import { resizeBusinessStructure } from '#shared/utils';

@Pipe({
  name: 'abbreviatedBusinessName',
})
export class AbbreviatedBusinessNamePipe implements PipeTransform {
  transform(value: string): string {
    return resizeBusinessStructure(value);
  }
}
