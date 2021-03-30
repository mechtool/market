import { CartDataOrderRelationResponseModel } from './cart-data-order-relation-response.model'
import { CartDataOrderOkeiResponseModel } from './cart-data-order-unit-okei-response.model';
import { TradeOfferStockEnumModel } from '#shared/modules';

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
      tradeOfferId: string;
      sid: string;
      productName: string;
      productDescription: string;
      barCodes: string[];
      partNumber: string;
      packaging: string;
      imageUrls: string[];
      unitOkei: CartDataOrderOkeiResponseModel;
      quantity: number;
      price?: number;
      priceBeforeDiscount?: number;
      priceIncludesVAT?: boolean;
      itemTotal: {
        totalWithoutVat: number;
        total: number;
        totalVat: number;
        currencyCode: string;
      };
      vat: 'VAT_10' | 'VAT_20' | 'VAT_WITHOUT';
      maxDaysForShipment: number;
      orderQtyMin: number,
      orderQtyStep: number,
      stockAmount: number,
      stockLevel: TradeOfferStockEnumModel,
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
  customersAudience?: {
    id: string;
    name: string;
    legalId: string;
  }[];
  orderTotal: {
    totalWithoutVat: number;
    total: number;
    totalVat: number;
    currencyCode: string;
  };
  tags: string[];
  makeOrderViolations?: {
    code: string;
    message: string;
    tradeOfferId?: string;
  }[];
  _links?: CartDataOrderRelationResponseModel;
}

