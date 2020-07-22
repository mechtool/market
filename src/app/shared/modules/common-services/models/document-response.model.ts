export class DocumentResponseModel {
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
  sourceOrganization: DocumentOrganizationModel;
  destinationOrganization: DocumentOrganizationModel;
  destinationOrganizationDepartmentId: number;
  info: string;
  moneyAmount: number;
  currency: number;
  metaData: string;
  person: DocumentPersonModel;
  contextName: string;
  contextIds: string[];
}

export class DocumentOrganizationModel {
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


export class DocumentPersonModel {
  name: string;
  phone: string;
  email: string;
  notifyByEmail: boolean;
}
