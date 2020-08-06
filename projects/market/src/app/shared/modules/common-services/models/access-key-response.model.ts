export class AccessKeyResponseModel {
  keyId: string;
  status: string;
  creationDate: string;
  activationDate: string;
  accessCode: string;
  accessCodeExpirationDate: string;
  organization: {
    id: string;
    name: string;
    inn: string;
    kpp: string;
  };
  notes: string;
  cid: string;
  app: string;
}
