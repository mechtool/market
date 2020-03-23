import { by, element } from 'protractor';

export class LoginItsPage {

  userLogin = 'testUser704';
  userPassword = 'doNotChangePassword!';

  getLoginInput() {
    const loginInputElement = element(by.css('.page .controls #username'));
    return loginInputElement;
  }

  getPasswordInput() {
    const passwordInputElement = element(by.css('.page .controls #password'));
    return passwordInputElement;
  }

  getLoginButton() {
    const loginBtnElement = element(by.css('.page #loginButton'));
    return loginBtnElement;
  }

  async authUser() {
    await this.getLoginInput().sendKeys(this.userLogin);
    await this.getPasswordInput().sendKeys(this.userPassword);
    await this.getLoginButton().click();
  }

}
