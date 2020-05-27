import { OrganizationLegalRequisitesModel } from './organization-legal-requisites.model';

export class UserOrganizationModel {
  organizationId: string;
  organizationName: string;
  legalRequisites: OrganizationLegalRequisitesModel;
  userGrants?: {
    isAdmin: boolean;
  };
}
