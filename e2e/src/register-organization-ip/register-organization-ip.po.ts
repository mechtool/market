import { by, element, ElementArrayFinder, ElementFinder } from 'protractor';

export class RegisterOrganizationIPPage {

  getRegisterOrganizationIP(): ElementFinder {
    return element(by.css('market-organization-operate'));
  }

  getOrganizationNameElement(): ElementFinder {
    return this.getRegisterOrganizationIP().element(by.css('#organizationName'));
  }

  getOrganizationContactFioElement(): ElementFinder {
    return this.getRegisterOrganizationIP().element(by.css('#contactFio'));
  }

  getOrganizationContactEmailElement(): ElementFinder {
    return this.getRegisterOrganizationIP().element(by.css('#contactEmail'));
  }

  getOrganizationContactPhoneElement(): ElementFinder {
    return this.getRegisterOrganizationIP().element(by.css('#contactPhone'));
  }

  getOrganizationAgreeElement(): ElementFinder {
    return this.getRegisterOrganizationIP().element(by.css('label[formcontrolname="agree"] input[type="checkbox"]'));
  }

  getBtnElement(): ElementFinder {
    return this.getRegisterOrganizationIP().element(by.css('button'));
  }

}

