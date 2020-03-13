import { by, element } from 'protractor';

export class AppPage {

  async getTitleText(): Promise<string> {
    const titleElement = element(by.css('c-app .content span'));
    return await titleElement.getText();
  }

}
