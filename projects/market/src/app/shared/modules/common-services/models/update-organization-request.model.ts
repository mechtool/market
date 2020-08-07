export class UpdateOrganizationRequestModel {
  name?: string;
  description?: string;
  contacts?: {
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
  };
  legalRequisites?: {
    kpp: string;
  }
}
