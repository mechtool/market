import { Pipe, PipeTransform } from '@angular/core';
import { stringToHex, stringToRGB } from '#shared/utils';

@Pipe({
  name: 'organizationLogo',
})
export class OrganizationLogoPipe implements PipeTransform {
  transform(value: string, isHex: boolean = false): any {
    return isHex ? { 'background-color': stringToHex(value) } : { 'background-color': stringToRGB(value) };
  }
}
