export class TradeOfferInfoModel {
  id: string;
  description?: string;
  price?: number;
  stock?: number;
  supplierId?: string;
  supplierName?: string;
  isSpecialPrice: boolean;
}
