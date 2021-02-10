import { browser, by, element } from 'protractor';

export const { userLogin, userPassword } = browser.params.credentials;

export class LoginItsPage {

  getLoginInput() {
    return element(by.css('.page .controls #username'));
  }

  getPasswordInput() {
    return element(by.css('.page .controls #password'));
  }

  getLoginButton() {
    return element(by.css('.page #loginButton'));
  }

}
