import { by, element, ElementFinder } from 'protractor';

export class AppPage {

  getCookieAgreement(): ElementFinder {
    return element(by.css('market-cookie-agreement .cookie-agreement'));
  }

  getCloseCookie(): ElementFinder {
    return element(by.css('market-cookie-agreement .after_close'));
  }

  getRegionNotification(): ElementFinder {
    return element(by.css('nz-notification .question'));
  }

  getAcceptRegionNotification(): ElementFinder {
    return element(by.cssContainingText('button', 'Да, все верно'));
  }

  getSearchResultsTitle(): ElementFinder {
    return element(by.css('market-search-results .title span'));
  }

  getTradeOfferTitle(): ElementFinder {
    return element(by.css('market-product-gallery h2.title'));
  }

  getTradeOfferFeaturesTitle(): ElementFinder {
    return element(by.cssContainingText('h3', 'Особенности предложения'));
  }

  getAnonymousMenuElement(): ElementFinder {
    return element(by.id('anonymous_menu_id'));
  }

  getAuthenticatedMenuElement(): ElementFinder {
    return element(by.id('authenticated_menu_id'));
  }

  getLoginElement(): ElementFinder {
    return element(by.id('login_menu_id'));
  }

  getRegisterElement(): ElementFinder {
    return element(by.id('register_menu_id'));
  }

  getLogoutElement(): ElementFinder {
    return element(by.cssContainingText('li', 'Выход'));
  }

  getPromoElement(): ElementFinder {
    return element(by.cssContainingText('li', 'Акции'));
  }

  getRegisterOrganizationElement(): ElementFinder {
    return element(by.cssContainingText('h2', 'Регистрация новой организации'));
  }

}
