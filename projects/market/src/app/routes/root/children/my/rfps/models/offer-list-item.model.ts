import { DocumentResponseModel } from '#shared/modules';

export class OfferListItemModel {
  id: number;
  customerName: string;
  customerInn: string;
  supplierName: string;
  supplierInn: string;
  orderNumber: string;
  orderDate: number;
  totalPrice: number;
  currency: string;
  status?: string;
  sentDate?: number;
  receivedDate?: number;
  rfpId?: string;

  constructor(doc: DocumentResponseModel) {
    this.id = doc.id;
    this.customerName = doc.destinationOrganization.title;
    this.customerInn = doc.destinationOrganization.inn;
    this.supplierName = doc.sourceOrganization.title;
    this.supplierInn = doc.sourceOrganization.inn;
    this.orderNumber = doc.documentTitle;
    this.orderDate = doc.sentDate;
    this.totalPrice = doc.moneyAmount;
    this.currency = doc.currency?.toString();
    this.status = doc.deliveryStatus;
    this.sentDate = doc.sentDate;
    this.receivedDate = doc.receivedDate;
    this.rfpId = null;
  }

  setRfpId(rfpId: string) {
    this.rfpId = rfpId;
    return this;
  }

}
