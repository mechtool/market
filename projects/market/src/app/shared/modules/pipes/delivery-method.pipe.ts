import { Pipe, PipeTransform } from '@angular/core';
import { TradeOfferDeliveryDescriptionModel } from '#shared/modules/common-services/models';

@Pipe({
  name: 'marketDeliveryMethod',
})
export class DeliveryMethodPipe implements PipeTransform {
  transform(deliveryDescription: TradeOfferDeliveryDescriptionModel): string {
    if (deliveryDescription?.deliveryRegions && deliveryDescription?.pickupFrom) {
      return 'доставка и самовывоз';
    }
    if (deliveryDescription?.pickupFrom) {
      return 'самовывоз';
    }
    if (deliveryDescription?.deliveryRegions || !(deliveryDescription?.deliveryRegions && deliveryDescription?.pickupFrom)) {
      return 'доставка';
    }
    return null;
  }
}
