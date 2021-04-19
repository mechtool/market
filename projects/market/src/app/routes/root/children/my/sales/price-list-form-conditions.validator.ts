import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const deliveryRegionsOrPickupFromValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors => {
  const deliveryRegions = formGroup.get('deliveryRegions').value;
  const pickupFrom = formGroup.get('pickupFrom').value;
  return !deliveryRegions.length && !pickupFrom.length ? { emptyDeliveryAndPickup: true } : null
};
