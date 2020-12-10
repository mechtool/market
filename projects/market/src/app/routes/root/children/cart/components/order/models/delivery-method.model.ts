import { DeliveryMethod } from '#shared/modules/common-services/models/delivery-method-enum.model';

export class DeliveryMethodModel {
  label: 'Самовывоз' | 'Доставка' | 'Доставка отсутствует' | 'Самовывоз отсутствует';
  value: DeliveryMethod.PICKUP | DeliveryMethod.DELIVERY;
  disabled: true | false;
}
