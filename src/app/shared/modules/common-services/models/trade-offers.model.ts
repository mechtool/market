export class TradeOffersModel {
  id: string;
  price: number;
  stock: Stock;
  supplier: TradeOffersSupplierModel;
  orderPlacingReference: string;
}

export enum Stock {
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export class TradeOffersSupplierModel {
  id: string;
  name: string;
  legalId: string;
  inn: string;
  kpp: string;
}
