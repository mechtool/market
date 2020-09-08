import { by, element, ElementFinder } from 'protractor';

export class AppPage {
  getNavbarElement(): ElementFinder {
    const navbarElement = element(by.css('market-navbar'));
    return navbarElement;
  }

  getNavbarContainerElement(): ElementFinder {
    const navbarContainerElement = element(by.css('market-navbar market-navbar-nav'));
    return navbarContainerElement;
  }

  getNavbarLogoElement(): ElementFinder {
    const navbarLogoElement = element(by.css('market-navbar market-navbar-nav .logo .opener'));
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
  //   const titleElement = element(by.css('market-app .content span'));
  //   return await titleElement.getText();
  // }

  // getUserMenuLink() {
  //   const userMenuLink = element(by.css('.user-menu > a'));
  //   return userMenuLink;
  // }
}
