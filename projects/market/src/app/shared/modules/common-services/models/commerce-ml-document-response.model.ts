export class CommerceMlDocumentResponseModel {
  id: string;
  numberOperation: string;
  dateOperation: number;
  typeOperation: string;
  role: string;
  currency: string;
  course: number;
  totalSum: number;
  sender: Organization;
  recipient: Organization;
  products: Product[];
  signatory: string;
  outcome: Outcome[];
}

class Organization {
  name: string;
  inn: string;
  kpp: string;
  address: string;
  contact: Contact;
  role: string;
}

class Outcome {
  key: string;
  value: string;
}

class Product {
  partNumber: string;
  productName: string;
  baseUnit: BaseUnit;
  price: number;
  amount: number;
  totalPrice: number;
  coefficient: number;
  tax: Tax;
}

class Contact {
  type: string;
  value: string;
}

class BaseUnit {
  code: string;
  abbreviation: string;
  shortName: string;
  fullName: string;
}

class Tax {
  name: string;
  vat: string;
  vatSum: number;
  includesVat: boolean;
}
