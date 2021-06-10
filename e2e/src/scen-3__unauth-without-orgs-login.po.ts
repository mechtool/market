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

  getLoginElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Войти'));
  }

  getRegisterElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Зарегистрироваться'));
  }

  getLogoutElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Выход'));
  }

  getMyOrdersElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Мои заказы'));
  }

  getPromoElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Акции'));
  }

  getRegisterOrganizationElement(): ElementFinder {
    return element(by.cssContainingText('h2', 'Регистрация новой организации'));
  }

}
