import { by, element, ElementFinder } from 'protractor';

export class RegisterOrganizationIPPage {

  getRegisterOrganizationIP(): ElementFinder {
    return element(by.css('market-organization-manage'));
  }

  getOrganizationInnElement(): ElementFinder {
    return this.getRegisterOrganizationIP().element(by.id('inn'));
  }

  getOrganizationNameElement(): ElementFinder {
    return this.getRegisterOrganizationIP().element(by.id('name'));
  }

  getOrganizationContactFioElement(): ElementFinder {
    return this.getRegisterOrganizationIP().element(by.id('contactPersonFullName'));
  }

  getOrganizationContactEmailElement(): ElementFinder {
    return this.getRegisterOrganizationIP().element(by.id('contactPersonEmail'));
  }

  getOrganizationContactPhoneElement(): ElementFinder {
    return this.getRegisterOrganizationIP().element(by.id('contactPersonPhone'));
  }

  getOrganizationAgreeElement(): ElementFinder {
    return element(by.css('.ant-checkbox-wrapper .ant-checkbox'));
  }

  getBtnElement(): ElementFinder {
    return element(by.buttonText('Сохранить'));
  }

}

