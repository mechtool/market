import { by, element } from 'protractor';

export class LoginItsPage {

  userLogin = 'testUser704';
  userPassword = 'doNotChangePassword!';

  getLoginInput() {
    return element(by.css('.page .controls #username'));
  }

  getPasswordInput() {
    return element(by.css('.page .controls #password'));
  }

  getLoginButton() {
    return element(by.css('.page #loginButton'));
  }

  async authUser() {
    await this.getLoginInput().sendKeys(this.userLogin);
    await this.getPasswordInput().sendKeys(this.userPassword);
    await this.getLoginButton().click();
  }

}
