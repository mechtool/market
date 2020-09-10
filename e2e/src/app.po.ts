import { by, element, ElementFinder } from 'protractor';

export class AppPage {
  getNavbarElement(): ElementFinder {
    return element(by.css('market-navbar'));
  }

  getNavbarContainerElement(): ElementFinder {
    return element(by.css('market-navbar market-navbar-nav'));
  }

  getNavbarLogoElement(): ElementFinder {
    return element(by.css('market-navbar market-navbar-nav .logo .opener'));
  }

  getMainElement(): ElementFinder {
    return element(by.css('main'));
  }

  getNavBarLKElement(): ElementFinder {
    return element(by.cssContainingText('.nav-list_item', 'Личный кабинет'));
  }

  getNavBarLoginElement(): ElementFinder {
    return element(by.cssContainingText('.nav-list_item', 'Войти'));
  }

  getNavBarMyOrdersElement(): ElementFinder {
    return element(by.cssContainingText('.nav-list_item', 'Мои заказы'));
  }

  // async getTitleText(): Promise<string> {
  //   const titleElement = element(by.css('market-app .content span'));
  //   return await titleElement.getText();
  // }

  // getUserMenuLink() {
  //   return element(by.css('.user-menu > a'));
  // }
}
