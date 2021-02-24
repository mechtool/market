import { OrganizationLegalRequisitesModel } from './organization-legal-requisites.model';
import { VerificationStatusEnum } from '#shared/modules/common-services/models/verification-status.model';

export class OrganizationResponseModel {
  id: string;
  name: string;
  description?: string;
  contacts?: OrganizationContactsModel;
  legalRequisites: OrganizationLegalRequisitesModel;
  contactPerson?: {
    fullName?: string;
    email?: string;
    phone?: string;
    position?: string;
  };
  verificationStatus: VerificationStatusEnum;
}

export class OrganizationContactsModel {
  email: string;
  phone: string;
  website: string;
  address: string;
}
