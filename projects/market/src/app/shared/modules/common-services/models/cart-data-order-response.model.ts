import { CartDataOrderRelationResponseModel } from './cart-data-order-relation-response.model'
import { CartDataOrderOkeiResponseModel } from './cart-data-order-unit-okei-response.model';

export class CartDataOrderResponseModel {
  supplier: {
    name: string;
    inn: string;
    kpp: string;
    phone: string;
    email: string;
  };
  items: [
    {
      productName: string;
      productDescription: string;
      barCodes: string[];
      partNumber: string;
      packaging: string;
      imageUrls: string[];
      unitOkei: CartDataOrderOkeiResponseModel;
      quantity: number;
      price: number;
      priceIncludesVAT: boolean;
      itemTotal: {
        total: number;
        totalVat: number;
        currencyCode: string;
      };
      vat: 'VAT_10' | 'VAT_20' | 'VAT_WITHOUT';
      orderConstraintViolations: { message: string; }[];
      maxDaysForShipment: number;
      availabilityStatus: string;
      _links: CartDataOrderRelationResponseModel;
    }
  ];
  deliveryOptions: {
    pickupPoints?: {
      fiasCode: string;
      title: string;
      countryOksmCode: string;
    }[];
    deliveryZones?: {
      fiasCode: string;
      title: string;
      countryOksmCode: string;
    }[];
  };
  customersAudience: {
    id: string;
    name: string;
    legalId: string;
  }[];
  orderTotal: {
    total: number;
    totalVat: number;
    currencyCode: string;
  };
  orderConstraintViolations: { message: string; }[];
  _links?: CartDataOrderRelationResponseModel;
}

