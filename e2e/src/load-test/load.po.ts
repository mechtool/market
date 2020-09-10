import { by, element, ElementArrayFinder, ElementFinder } from 'protractor';

export class AppLoadPage {

  getSearchBar(): ElementFinder {
    return element(by.css('market-search-bar'));
  }

  getSearchBarFilterOrganizationInput(): ElementFinder {
    return element(by.css('market-search-bar-filter #formFilterInn'));
  }

  getListAutoOptions(): ElementArrayFinder {
    return element.all(by.css('nz-auto-option .ant-select-item-option-content'));
  }

  getCheckboxWithImages(): ElementFinder {
    return element(by.css('#withImages'));
  }

  getSaveFiltersButton(): ElementFinder {
    return element(by.css('#saveFilters'));
  }

  getProductSideToCartButtonInTradeOfferPage(): ElementArrayFinder {
    return element.all(by.css('market-product-side'));
  }

  getSupplierNameRouterLink(): ElementFinder {
    return element(by.css('#supplierNameRouterLink'));
  }

  getSearchResults(): ElementFinder {
    return element(by.css('market-search-results'));
  }

  getSearchBarInput(): ElementFinder {
    return element(by.css('market-search-bar #search_bar_input'));
  }

  getDeliveryAddressInput(): ElementFinder {
    return element(by.css('market-cart-order #delivery_address_input'));
  }

  getContactPhoneInput(): ElementFinder {
    return element(by.css('market-cart-order #contactPhone'));
  }

  getSearchBarFilter(): ElementFinder {
    return element(by.css('market-search-bar-filter'));
  }

  getSearchBarFilterButton(): ElementFinder {
    return element(by.css('market-search-bar #search_bar_filter'));
  }

  getSearchBarButton(): ElementFinder {
    return element(by.css('market-search-bar #search_bar_button'));
  }

  getProductGallery(): ElementFinder {
    return element(by.css('market-product-gallery'));
  }

  getTradeOfferCardList(): ElementFinder {
    return element(by.css('market-trade-offer-cards-list'));
  }

  getAllTradeOfferCards(): ElementArrayFinder {
    return element.all(by.css('market-trade-offer-info-card'));
  }

  getSuppliersTradeOffersList(): ElementFinder {
    return element(by.css('market-supplier-trade-offers-list'));
  }

  getAllProductCards(): ElementArrayFinder {
    return element.all(by.css('market-card'));
  }

  getAllBreadcrumbItems(): ElementArrayFinder {
    return element.all(by.css('nz-breadcrumb-item'));
  }

  getCartElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Корзина'));
  }

  getMyOrdersElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Мои заказы'));
  }

  getNavBarPersonalAccountElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Личный кабинет'));
  }

  getNavBarLoginElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Войти'));
  }

  getNavBarLogoutElement(): ElementFinder {
    return element(by.cssContainingText('.item', 'Выход'));
  }

  getLoginInput(): ElementFinder {
    return element(by.css('.controls #username'));
  }

  getPasswordInput(): ElementFinder {
    return element(by.css('.controls #password'));
  }

  getLoginButton(): ElementFinder {
    return element(by.css('.page #loginButton'));
  }

  getCheckoutButton(): ElementFinder {
    return element(by.css('market-cart-order #checkoutButton'));
  }

  getMarketCartOrder(): ElementFinder {
    return element(by.css('market-cart-order'));
  }

  getTabOrderingData(): ElementFinder {
    return element(by.cssContainingText('.ant-tabs-tab', 'Данные для заказа'));
  }

  getNavBarPersonalAccount(): ElementFinder {
    return element(by.css('#my_orders_button'));
  }

  getMarketOrderSent(): ElementFinder {
    return element(by.css('market-order-sent'));
  }

  getMarketOrderList(): ElementFinder {
    return element(by.css('market-order-list'));
  }

  getCloseCookie(): ElementFinder {
    return element(by.css('.anticon-close'));
  }

  getSpinnerSpinning(): ElementFinder {
    return element(by.css('nz-spin .ant-spin-spinning'));
  }

}
