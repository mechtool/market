import { OrganizationLegalRequisitesModel } from './organization-legal-requisites.model';

export class OrganizationResponseModel {
  id: string;
  name: string;
  description?: string;
  contacts?: OrganizationContactsModel;
  legalRequisites: OrganizationLegalRequisitesModel;
}

export class OrganizationContactsModel {
  email: string;
  phone: string;
  website: string;
  address: string;
}
