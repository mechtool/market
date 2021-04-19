import { DocumentResponseModel } from './document-response.model';

export class DocumentDto {
  id: number;
  party: string;
  partyInn: string;
  orderNumber: string;
  orderDate: number;
  price: number;
  currency: string;
  status?: string;
  sentDate?: number;
  receivedDate?: number

  static forOutboundOrder(model: DocumentResponseModel): DocumentDto {
    return {
      id: model.id,
      party: model.destinationOrganization.title,
      partyInn: model.destinationOrganization.inn,
      orderNumber: model.documentTitle,
      orderDate: model.sentDate,
      price: model.moneyAmount,
      currency: model.currency?.toString(),
      status: model.deliveryStatus,
      sentDate: model.sentDate,
      receivedDate: model.receivedDate,
    };
  }

  static forInboundOrder(model: DocumentResponseModel): DocumentDto {
    return {
      id: model.id,
      party: model.sourceOrganization.title,
      partyInn: model.sourceOrganization.inn,
      orderNumber: model.documentTitle,
      orderDate: model.sentDate,
      price: model.moneyAmount,
      currency: model.currency?.toString(),
      status: model.deliveryStatus,
      sentDate: model.sentDate,
      receivedDate: model.receivedDate,
    };
  }

  static forAccount(model: DocumentResponseModel): DocumentDto {
    return {
      id: model.id,
      party: model.sourceOrganization.title,
      partyInn: model.sourceOrganization.inn,
      orderNumber: model.documentTitle,
      orderDate: model.sentDate,
      price: model.moneyAmount,
      currency: model.currency?.toString(),
      status: model.deliveryStatus,
    };
  }
}
