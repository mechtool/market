export class CommerceOfferMlModel {
  id: string;
  number: string;
  date: string;
  requestId: string;
  supplier: Organization;
  customer: Organization;
  dateActualTo: string;
  contact: Contact
  products?: Product[];

  constructor(commerceMl: string) {
    const rawObj = JSON.parse(commerceMl);
    this.id = rawObj.CommerceOffer._attributes.id;
    this.number = rawObj.CommerceOffer._attributes.number;
    this.date = rawObj.CommerceOffer._attributes.date;
    this.requestId = rawObj.CommerceOffer._attributes.requestId;
    this.supplier = new Organization(rawObj.CommerceOffer.supplier);
    this.customer = new Organization(rawObj.CommerceOffer.customer);
    this.dateActualTo = rawObj.CommerceOffer.TermsAndConditions._attributes.dateOfferActualTo;
    this.contact = new Contact(rawObj.CommerceOffer.Contacts);
    this.products = rawObj.CommerceOffer.products.map((product) => new Product(product));
  }
}

class Product {
  amount: string;
  productName: string;
  maxDeliveryDaysAfterOrder: string;
  price: string;
  vat: string;
  amountWithVAT: string;
  amountWithoutVAT: string;
  amountVAT: string;

  constructor(productData: any) {
    this.amount = productData._attributes.count;
    this.productName = productData.product._attributes.productName;
    this.maxDeliveryDaysAfterOrder = productData.maxDeliveryDaysAfterOrder._text;
    this.price = productData.priceAndTaxes._attributes.price;
    this.vat = productData.priceAndTaxes._attributes.vat.toUpperCase();
    this.amountWithVAT = productData.priceAndTaxes._attributes.amountIncVat;
    this.amountWithoutVAT = productData.priceAndTaxes._attributes.amountExcVat;
    this.amountVAT = productData.priceAndTaxes._attributes.VatAmount;
  }

}

class Organization {
  name: string = null;
  inn: string = null;
  kpp: string = null;
  address: string = null;

  constructor(orgData: any) {
    if (orgData.individualEntrepreneur) {
      this.name = `${orgData.individualEntrepreneur._attributes.surname} ${orgData.individualEntrepreneur._attributes.name} ${orgData.individualEntrepreneur._attributes.patronymic}`.trim();
      this.inn = orgData.individualEntrepreneur._attributes.inn;
      this.kpp = orgData.individualEntrepreneur._attributes.kpp;
      this.address = orgData.address._attributes.name;
    }
    return null;
  }
}

class Contact {
  name: string;
  email: string;

  constructor(contactData: any) {
    this.name = contactData._attributes.contactName;
    this.email = contactData._attributes.email;
  }
}
