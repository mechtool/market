export class TradeOfferSupplierModel {
  bnetInternalId: string;
  inn: string;
  kpp: string;
  name: string;
  description: string;
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
  isVerifiedOrg?: boolean;
}
