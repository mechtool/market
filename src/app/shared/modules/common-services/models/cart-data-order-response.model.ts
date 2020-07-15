import { CartDataOrderUnitOfMeasureMentResponseModel } from './cart-data-order-unit-of-measurement-response.model';
import { CartDataOrderRelationResponseModel } from './cart-data-order-relation-response.model'

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
      unitOfMeasurement: CartDataOrderUnitOfMeasureMentResponseModel;
      quantity: number;
      price: number;
      priceIncludesVAT: boolean;
      costSummary: {
        totalCost: number;
        vat: number;
        totalVat: number;
        priceCurrency: string;
      };
      maxDaysForShipment: number;
      availabilityStatus: string;
      _links: CartDataOrderRelationResponseModel;
    }
  ];
  deliveryOptions: {
    pickupPoints?: {
      fiasCode: string;
      name: string;
      countryOksmCode: string;
    }[];
    deliveryZones?: {
      fiasCode: string;
      name: string;
      countryOksmCode: string;
    }[];
  };
  customersAudience: string[];
  costSummary: {
    totalCost: number;
    vat: number;
    totalVat: number;
    priceCurrency: string;
  };
  _links?: CartDataOrderRelationResponseModel;
}

