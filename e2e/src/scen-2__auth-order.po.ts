import { by, element, ElementArrayFinder, ElementFinder } from 'protractor';

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

  getSearchFilterPanelControlSupplierInput(): ElementFinder {
    return element(by.css('div[formgroupname="supplier"] input'));
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

  getCartTitle(): ElementFinder {
    return element(by.css('.cart .title'));
  }

  getCartProductsTitles(): ElementArrayFinder {
    return element.all(by.css('.table_cell.cell_title'));
  }

  getCartMakeOrderButton(): ElementFinder {
    return element(by.buttonText('Оформить заказ'));
  }

  getTradeOfferCounterTitle(): ElementFinder {
    return element(by.css('.catalog_header__count'));
  }

  getCartMakeOrderContactName(): ElementFinder {
    return element(by.id('contactName'));
  }

  getCartMakeOrderContactPhone(): ElementFinder {
    return element(by.id('contactPhone'));
  }

  getCartMakeOrderContactEmail(): ElementFinder {
    return element(by.id('contactEmail'));
  }

  getCartMakeOrderCommentForSupplier(): ElementFinder {
    return element(by.id('commentForSupplier'));
  }

  getDeliveryMethod(): ElementFinder {
    return element(by.css('market-order-details nz-radio-group[formcontrolname="deliveryMethod"] .ant-radio-wrapper-checked'));
  }

  getDelivery(): ElementFinder {
    return element(by.cssContainingText('label', 'Доставка'));
  }

  getDeliveryCitySelect(): ElementFinder {
    return element(by.css('.ant-form nz-select-item'));
  }

  getCustomerSelect(): ElementFinder {
    return element(by.css('.order__customer nz-select-item'));
  }

  getDeliveryCityInput(): ElementFinder {
    return element(by.id('deliveryCity'));
  }

  getDeliveryStreetInput(): ElementFinder {
    return element(by.id('deliveryStreet'));
  }

  getDeliveryHouseInput(): ElementFinder {
    return element(by.id('deliveryHouse'));
  }

  getModalOrderSent(): ElementFinder {
    return element(by.css('market-order-sent'));
  }

  getLoginElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Войти'));
  }

  getMyOrdersElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Мои заказы'));
  }

  getErrors(): ElementArrayFinder {
    return element.all(by.css('.ant-form-item-explain-error'))
  }

  getInputErrors(): ElementArrayFinder {
    return element.all(by.css('.ant-input .error'));
  }

  getFormErrors(): ElementFinder {
    return element(by.css('.form-with-errors'));
  }

}
