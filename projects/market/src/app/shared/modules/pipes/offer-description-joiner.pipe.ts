import { Pipe, PipeTransform } from '@angular/core';
import { TradeOfferDescriptionModel } from '#shared/modules/common-services/models/trade-offer-description.model';

@Pipe({
  name: 'marketOfferDescriptionJoiner',
})
export class OfferDescriptionJoinerPipe implements PipeTransform {
  transform(offerDescription: TradeOfferDescriptionModel): string {
    if (offerDescription?.title && offerDescription?.description) {
      return `${offerDescription.title} ${offerDescription.description}`;
    }
    if (offerDescription?.title) {
      return offerDescription.title;
    }
    if (offerDescription?.description) {
      return offerDescription?.description;
    }
    return null;
  }
}
