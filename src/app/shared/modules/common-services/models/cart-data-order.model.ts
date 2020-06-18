import { RelationModel } from './relation.model'

export class CartDataOrderModel {
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
      quantity: number;
      price: number;
      maxDaysForShipment: number;
      availabilityStatus: string;
      _links: RelationModel;
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
  _links?: RelationModel;
}

