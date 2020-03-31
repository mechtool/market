export class UserOrganizationModel {
  organizationId: string;
  organizationName: string;
  legalRequisites: {
    inn: string;
    kpp: string;
  };
  userGrants?: {
    isAdmin: boolean;
  };
}
