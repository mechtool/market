import { Pipe, PipeTransform } from '@angular/core';
import { resizeBusinessStructure } from '#shared/utils';
import { CommerceMlDocumentResponseModel } from '#shared/modules/common-services/models';

@Pipe({
  name: 'marketCounterPartLine',
})
export class CounterPartLinePipe implements PipeTransform {
  transform(value: CommerceMlDocumentResponseModel, counterPartType: 'sender' | 'recipient' = 'sender'): string {
    const org = value[counterPartType];
    return `${org.role}: ${resizeBusinessStructure(org.name)}, ИНН ${org.inn}${org.kpp ? `, КПП ${org.kpp}` : ''}${org.address ? `,${org.address}` : ''}${org.contact ? `,${org.contact.type}: ${org.contact.value}` : ''}`;
  }
}
