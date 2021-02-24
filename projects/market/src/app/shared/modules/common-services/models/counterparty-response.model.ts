export class CounterpartyResponseModel {
  inn?: string;
  kpp?: string;
  name?: string;
  typePerson?: TypePersonEnum;
  status?: Status;
  registrationDate?: string;
  legalPerson?: LegalPerson;
  naturalPerson?: NaturalPerson;
  mainActivity?: MainActivity;
}

export enum TypePersonEnum {
  LEGAL_PERSON = 'LEGAL_PERSON',
  NATURAL_PERSON = 'NATURAL_PERSON'
}

class Status {
  isActive: boolean;
  reason: string;
}

class LegalPerson {
  address: Address;
  headPersonInfo: HeadPersonInfo;
  employees: Employee[];
  paidTaxes: PaidTax[];
}

class NaturalPerson {
  citizenship: string;
}

class HeadPersonInfo {
  date: string;
  name: string;
  position: string;
}

class Address {
  date: string;
  name: string;
}

class MainActivity {
  code: string;
  name: string;
}


class Employee {
  year: number;
  count: number;
}

class PaidTax {
  year: number;
  taxes: Tax[];
}

class Tax {
  name: string;
  paid: string;
}
