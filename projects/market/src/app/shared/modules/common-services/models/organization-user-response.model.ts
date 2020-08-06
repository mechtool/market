export class OrganizationUserResponseModel {
  uin: string;
  userGrants: {
    isAdmin: boolean;
  };
  person: {
    personName: string;
    userEmail: string;
  }
}
