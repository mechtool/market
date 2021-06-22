import { browser, by, element } from 'protractor';

export const {
  userLoginWithoutAvailableOrganizations,
  userLoginWithAvailableOrganizations,
  userLoginForMySales,
  userPassword
} = browser.params.credentials;

export class LoginItsPage {

  getLoginInput() {
    return element(by.name('username'));
  }

  getPasswordInput() {
    return element(by.name('password'));
  }

  getLoginButton() {
    return element(by.buttonText('Войти'));
  }

}
