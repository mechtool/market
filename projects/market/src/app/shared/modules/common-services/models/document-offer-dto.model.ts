export interface IDocumentOfferDTO {
  id: number;
  ancestorId: string;
  documentGuid: string;
  documentData: string;
  documentDataType: string;
  documentTitle: string;
  documentPresentationData: string;
  documentPresentationDataType: string;
  direction: string; // INBOUND или OUTBOUND
  deliveryStatus: string; // SENT, DELIVERED или REJECTED
  sentDate: number;
  receivedDate: number;
  sourceOrganization: IDocumentOfferOrganizationDTO;
  destinationOrganization: IDocumentOfferOrganizationDTO;
  destinationOrganizationDepartmentId: number;
  info: string;
  moneyAmount: number;
  currency: number;
  metaData: string;
  person: IDocumentPersonDTO;
  contextName: string;
  contextIds: string[];
  requestId: string;
}

export class IDocumentOfferOrganizationDTO {
  inn: string;
  kpp: string;
  title: string;
  titleFromFns: string;
  ogrn: string;
  site: string;
  email: string;
  address: string;
  phone: string;
  fax: string;
  description: string;
  tags: string[];
  showOrganizationInfo: boolean;
  registrationDate: number;
}

export class IDocumentPersonDTO {
  name: string;
  phone: string;
  email: string;
  notifyByEmail: boolean;
}
