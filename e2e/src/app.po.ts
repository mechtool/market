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

  getNavBarLKElement(): ElementFinder {
    const navBarLKElement = element(by.cssContainingText('.nav-list_item', 'Личный кабинет'));
    return navBarLKElement;
  }

  getNavBarLoginElement(): ElementFinder {
    const navBarLoginElement = element(by.cssContainingText('.nav-list_item', 'Войти'));
    return navBarLoginElement;
  }

  getNavBarMyOrdersElement(): ElementFinder {
    const navBarMyOrdersElement = element(by.cssContainingText('.nav-list_item', 'Мои заказы'));
    return navBarMyOrdersElement;
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
