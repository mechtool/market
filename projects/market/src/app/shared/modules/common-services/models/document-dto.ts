import { DocumentResponseModel } from './document-response.model';

export class DocumentDto {
  id: number;
  party: string;
  partyInn: string;
  orderNumber: string;
  orderDate: number;
  price: number;
  currency: string;

  static forOrder(model: DocumentResponseModel): DocumentDto {
    return {
      id: model.id,
      party: model.destinationOrganization.title,
      partyInn: model.destinationOrganization.inn,
      orderNumber: model.documentTitle,
      orderDate: model.sentDate,
      price: model.moneyAmount,
      currency: model.currency?.toString(),
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
    };
  }
}
