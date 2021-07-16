import { PriceListStatusEnum } from './price-list-feed-status-enum.model';

export class PriceListFeedResponseModel {
  priceListExternalId: string;
  priceListExternalUrl: string;
  contactsEmail: string;
  lastCompletionStatus?: PriceListStatusEnum;
  failMessage?: string;
  lastCompletionTime: string;
}

