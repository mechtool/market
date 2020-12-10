import { Pipe, PipeTransform } from '@angular/core';
import { ProductFeatureModel, ValueTypeEnum } from '#shared/modules/common-services/models';

@Pipe({
  name: 'marketFeatureValue',
})
export class FeatureValuePipe implements PipeTransform {
  transform(value: ProductFeatureModel): string {
    if (value.valueType === ValueTypeEnum.ENUMERATION) {
      return value.valueName;
    }

    if (value.valueType === ValueTypeEnum.BOOLEAN) {
      return value.value ? 'Да' : 'Нет';
    }

    return value.value;
  }
}
