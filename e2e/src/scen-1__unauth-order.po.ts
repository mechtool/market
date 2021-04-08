import { by, element, ElementArrayFinder, ElementFinder } from 'protractor';

export class AppPage {

  getCookieAgreement(): ElementFinder {
    return element(by.css('market-cookie-agreement .cookie-agreement'));
  }

  getCloseCookie(): ElementFinder {
    return element(by.css('market-cookie-agreement .after_close'));
  }

  getSearchBox(): ElementFinder {
    return element(by.css('market-search-box'));
  }

  getSearchBoxInput(): ElementFinder {
    return element(by.css('market-search-box market-search-box-input input'));
  }

  getSearchBoxButton(): ElementFinder {
    return element(by.css('market-search-box market-search-box-btn[iconpath="img/svg/icon__search.svg"] button'));
  }

  getSearchBoxFiltersButton(): ElementFinder {
    return element(by.css('market-search-box market-search-box-btn[iconpath="img/svg/icon__filter.svg"] button'));
  }

  getSearchFilterPanel(): ElementFinder {
    return element(by.css('market-search-filter'));
  }

  getSearchFilterPanelControlLocationInput(): ElementFinder {
    return element(by.css('div[formgroupname="location"] input'));
  }

  getGlobalSpinnerSpinning(): ElementFinder {
    return element(by.css('cdk-overlay-container .spinner'));
  }

  getSearchResults(): ElementFinder {
    return element(by.css('market-search-results'));
  }

  getSearchResultsTitle(): ElementFinder {
    return element(by.css('market-search-results .title span'));
  }

  getAllProductCards(): ElementArrayFinder {
    return element.all(by.css('market-card'));
  }

  getTradeOfferCardList(): ElementFinder {
    return element(by.css('market-trade-offer-cards-list'));
  }

  getAllTradeOfferCards(): ElementArrayFinder {
    return element.all(by.css('market-trade-offer-info-card'));
  }

  getTradeOfferTitle(): ElementFinder {
    return element(by.css('market-product-gallery h2.title'));
  }

  getTradeOfferFeaturesTitle(): ElementFinder {
    return element(by.cssContainingText('h3', 'Особенности предложения'));
  }

  getCartBlock(): ElementFinder {
    return element(by.css('.product > .product_side market-product-order'));
  }

  getCartBlockButton(): ElementFinder {
    return element(by.css('.product > .product_side market-product-order .to_cart__btn_wrap > button'));
  }

  getCartBlockPrice(): ElementFinder {
    return element(by.css('.product > .product_side market-product-order span[itemprop="price"]'));
  }

  getCartBlockSwitcher(): ElementFinder {
    return element(by.css('.product > .product_side market-product-order .switch_count'));
  }

  getCartBlockSwitcherInput(): ElementFinder {
    return element(by.css('.product > .product_side market-product-order .switch_count input'));
  }

  getCartBlockSwitcherIncreaser(): ElementFinder {
    return element(by.css('.product > .product_side market-product-order .switch_count .switch_count__increase'));
  }

  getCartBlockSwitcherDecreaser(): ElementFinder {
    return element(by.css('.product > .product_side market-product-order .switch_count .switch_count__decrease'));
  }

  getCartElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Корзина'));
  }

  getCartTitle(): ElementArrayFinder {
    return element.all(by.css('.cart .title'));
  }

  getCartProductsTitles(): ElementArrayFinder {
    return element.all(by.css('.table_cell.cell_title'));
  }

  getIsOrganizationAgent(): ElementArrayFinder {
    return element.all(by.css('.form-group-checkbox .ant-checkbox'));
  }

  getCartMakeOrderButton(): ElementFinder {
    return element(by.cssContainingText('button', 'Оформить заказ'));
  }

  getTradeOfferCounterTitle(): ElementFinder {
    return element(by.css('.catalog_header__count'));
  }


  getCartMakeOrderWithoutRegistrationButton(): ElementFinder {
    return element(by.cssContainingText('button', 'Заказать без регистрации'));
  }

  getCartMakeOrderFillCustomerDataButton(): ElementFinder {
    return element(by.cssContainingText('market-cart-order button', 'Заполнить данные заказчика '));
  }

  getCartMakeOrderContactName(): ElementFinder {
    return element(by.css('market-cart-order #contactName'));
  }

  getCartMakeOrderContactPhone(): ElementFinder {
    return element(by.css('market-cart-order #contactPhone'));
  }

  getCartMakeOrderContactEmail(): ElementFinder {
    return element(by.css('market-cart-order #contactEmail'));
  }

  getRequisitesChecker(): ElementFinder {
    return element(by.css('market-requisites-checker'));
  }

  getRequisitesCheckerInnInput(): ElementFinder {
    return element(by.css('market-requisites-checker')).element(by.css('#formINN'));
  }

  getRequisitesCheckerKppInput(): ElementFinder {
    return element(by.css('market-requisites-checker')).element(by.css('#formKPP'));
  }

  getRequisitesCheckerNameInput(): ElementFinder {
    return element(by.css('market-requisites-checker')).element(by.css('#formName'));
  }

  getRequisitesCheckerButton(): ElementFinder {
    return element(by.css('market-requisites-checker')).element(by.css('button'));
  }

  getDeliveryMethod(): ElementFinder {
    return element(by.css('market-cart-order nz-radio-group[formcontrolname="deliveryMethod"] .ant-radio-wrapper-checked'));
  }

  getDeliveryCity(): ElementFinder {
    return element(by.css('market-cart-order #city_delivery_address_input'));
  }

  getDeliveryStreet(): ElementFinder {
    return element(by.css('market-cart-order #street_delivery_address_input'));
  }

  getModalOrderSent(): ElementFinder {
    return element(by.cssContainingText('market-order-sent .title', 'Заказ отправлен поставщику'));
  }

}
