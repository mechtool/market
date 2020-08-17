import { DeliveryMethod } from '#shared/modules/common-services/models/delivery-method-enum.model';

export class DeliveryMethodModel {
  label: 'Самовывоз' | 'Доставка';
  value: DeliveryMethod.PICKUP | DeliveryMethod.DELIVERY;
}
