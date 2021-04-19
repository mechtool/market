import { PriceListStatusEnum } from './price-list-feed-status-enum.model';

export class PriceListFeedResponseModel {
  priceListExternalId: string;
  priceListExternalUrl: string;
  contactsEmail: string;
  status: PriceListStatusEnum;
  lastCompletionTime: string;
}

