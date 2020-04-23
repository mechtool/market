export class OffersModel {
  id: string;
  price: number;
  stock: Stock;
  supplier: OffersSupplierModel;
  orderPlacingReference: string;
  _links: {
    offer: OfferHrefModel;
  };
}

export enum Stock {
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export class OffersSupplierModel {
  id: string;
  inn: string;
  kpp: string;
  name: string;
}

export class OfferHrefModel {
  href: string;
}
