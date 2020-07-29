import { OrganizationLegalRequisitesModel } from "./organization-legal-requisites.model";

export class RegisterOrganizationRequestModel {
  legalRequisites: OrganizationLegalRequisitesModel;
  name: string;
  description?: string;
  contacts?: {
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
  };
  contactPerson: {
    fullName: string;
    email: string;
    phone: string;
    position?: string;
  };
}

