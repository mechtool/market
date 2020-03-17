import { by, element, ElementFinder } from 'protractor';

export class AppPage {

  getNavbarElement(): ElementFinder {
    const navbarElement = element(by.css('my-navbar'));
    return navbarElement;
  }

  getNavbarContainerElement(): ElementFinder {
    const navbarContainerElement = element(by.css('my-navbar .navbar'));
    return navbarContainerElement;
  }

  getNavbarLogoElement(): ElementFinder {
    const navbarLogoElement = element(by.css('my-navbar my-navbar-logo'));
    return navbarLogoElement;
  }

  getMainElement(): ElementFinder {
    const mainElement = element(by.css('main'));
    return mainElement;
  }


  // async getTitleText(): Promise<string> {
  //   const titleElement = element(by.css('my-app .content span'));
  //   return await titleElement.getText();
  // }

  // getUserMenuLink() {
  //   const userMenuLink = element(by.css('.user-menu > a'));
  //   return userMenuLink;
  // }

}
