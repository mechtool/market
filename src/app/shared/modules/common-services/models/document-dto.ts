import { DocumentResponseModel } from './document-response.model';

export class DocumentDto {
  id: number;
  party: string;
  orderNumber: string;
  orderDate: number;
  price: number;

  static forOrder(model: DocumentResponseModel): DocumentDto {
    return {
      id: model.id,
      party: model.destinationOrganization.title,
      orderNumber: model.documentTitle,
      orderDate: model.sentDate,
      price: model.moneyAmount,
    };
  }

  static forAccount(model: DocumentResponseModel): DocumentDto {
    return {
      id: model.id,
      party: model.sourceOrganization.title,
      orderNumber: model.documentTitle,
      orderDate: model.sentDate,
      price: model.moneyAmount,
    };
  }
}
