import { Pipe, PipeTransform } from '@angular/core';

const STATUS_CONVERTER = {
  WHITE_LIST: 'Предложение доступно организациям',
  BLACK_LIST: 'Предложение недоступно организациям',
};

@Pipe({
  name: 'marketRestrictionType',
})
export class RestrictionTypePipe implements PipeTransform {
  transform(value: string): string {
    return STATUS_CONVERTER[value];
  }
}

