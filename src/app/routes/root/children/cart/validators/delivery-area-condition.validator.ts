import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { DeliveryMethod } from '#shared/modules';

export const deliveryAreaConditionValidator: ValidatorFn = (fg: FormGroup): ValidationErrors => {
  const deliveryMethod = fg.get('deliveryMethod').value;
  const deliveryArea = fg.get('deliveryArea').value;
  return (deliveryMethod === DeliveryMethod.DELIVERY && (!deliveryArea || !isObject(deliveryArea))) ?
    { deliveryAreaCondition: true } : null;
};

function isObject(obj: any): boolean {
  return obj === Object(obj);
}
