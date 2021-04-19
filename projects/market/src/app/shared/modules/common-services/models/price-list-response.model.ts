import { PriceListStatusEnum } from './price-list-feed-status-enum.model';

export class PriceListResponseModel {
  id: string;
  supplierParty: {
    id: string;
    name: string;
    inn: string;
    kpp: string;
  };
  dateActualFrom: string;
  dateActualTo: string;
  name: string;
  currencyCode: string;
  externalCode: string;
  contacts: {
    personName: string;
    phone: string;
    email: string;
  };
  orderRestrictions: {
    sum: {
      minimum: number;
      includesVAT: boolean;
    }
  };
  deliveryDescription: {
    deliveryRegions: {
      countryOksmCode: string;
      fiasCode: string;
      name?: string;
    }[];
    pickupFrom: {
      countryOksmCode: string;
      fiasCode: string;
      name?: string;
    }[];
  };
  audience: {
    whiteList: {
      inn: string;
      kpp?: string;
      name?: string;
    }[];
  };
  feedInfo: {
    priceListExternalId: string;
    priceListExternalUrl: string;
    contactsEmail: string;
    status: PriceListStatusEnum;
    lastCompletionTime: string;
  };
}
