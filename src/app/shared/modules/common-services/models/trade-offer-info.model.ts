export class TradeOfferInfoModel {
  id: string;
  description?: string;
  price?: number;
  stock?: string; // todo: Должно быть number, но пока в апи такого нет
  supplierId?: string;
  supplierName?: string;
  isSpecialPrice: boolean;
}
