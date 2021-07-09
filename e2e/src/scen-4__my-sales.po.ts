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

  getAnonymousMenuElement(): ElementFinder {
    return element(by.id('anonymous_menu_id'));
  }

  getAuthenticatedMenuElement(): ElementFinder {
    return element(by.id('authenticated_menu_id'));
  }

  getLoginElement(): ElementFinder {
    return element(by.id('login_menu_id'));
  }

  getMySalesElement(): ElementFinder {
    return element(by.cssContainingText('li', 'Мои продажи'));
  }

  getMyPriceListElement(): ElementFinder {
    return element(by.cssContainingText('.ant-tabs-tab', 'Мои прайс-листы'));
  }

  getCustomerOrdersElement(): ElementFinder {
    return element(by.cssContainingText('.ant-tabs-tab', 'Заказы покупателей'));
  }

  getCategoriesSettingElement(): ElementFinder {
    return element(by.cssContainingText('.ant-tabs-tab', 'Настройка рубрикации'));
  }

  getPriceListTableElement(): ElementFinder {
    return element(by.css('market-price-list-table'));
  }

  getCategorySearchForm(): ElementFinder {
    return element(by.css('.category-search-form'));
  }

  getPriceListRows(): ElementArrayFinder {
    return element.all(by.css('.table_data'));
  }

  getEdit1cCategoryBtn(): ElementFinder {
    return this.getPriceListRows().first().element(by.css('button[nztooltiptitle="Изменить категорию 1СН"]'));
  }

  getOrderListTableElement(): ElementFinder {
    return element(by.css('market-order-list'));
  }

  getCategoriesSettingTableElement(): ElementFinder {
    return element(by.css('market-categories-setting'));
  }

  getUploadNewPriceListBtnElement(): ElementFinder {
    return element(by.buttonText('Загрузить прайс-лист'));
  }

  getEditPriceListBtn(): ElementFinder {
    return this.getPriceListRows().first().element(by.css('button[nztooltiptitle="Редактировать прайс-лист"]'));
  }

  getDeletePriceListBtn(): ElementFinder {
    return this.getPriceListRows().first().element(by.css('button[nztooltiptitle="Удалить прайс-лист"]'));
  }

  getDeletePriceListOkBtn(): ElementFinder {
    return element(by.buttonText('OK'));
  }

  getGoesToSupplierStoreBtn(): ElementFinder {
    return this.getPriceListRows().first().element(by.css('button[nztooltiptitle="Перейти в магазин поставщика"]'));
  }

  getSupplierStore(): ElementFinder {
    return element(by.css('market-supplier-trade-offers-list'));
  }

  getTradeOffers(): ElementArrayFinder {
    return element.all(by.css('.table_row'));
  }

  getPriceListCreatingFormElement(): ElementFinder {
    return element(by.css('.price-list-creating-form'));
  }

  getPriceListCreatingManualElement(): ElementFinder {
    return element(by.css('.manual'));
  }

  getExcelFileTemplateElement(): ElementFinder {
    return element(by.cssContainingText('a', 'шаблон excel-файла'));
  }

  getExcelUrlInput(): ElementFinder {
    return element(by.id('priceListExternalUrl'));
  }

  getPriceListNameInput(): ElementFinder {
    return element(by.id('name'));
  }

  getPriceListDatePicker(): ElementFinder {
    return element(by.css('nz-date-picker'));
  }

  getNextMonth(): ElementFinder {
    return element(by.css('.ant-picker-next-icon'))
  }

  getDates(): ElementArrayFinder {
    return element.all(by.css('.ant-picker-cell .ant-picker-cell-inner'));
  }

  getMinPriceInput(): ElementFinder {
    return element(by.id('minSum'));
  }

  getPersonNameInput(): ElementFinder {
    return element(by.id('personName'));
  }

  getPersonPhoneInput(): ElementFinder {
    return element(by.id('phone'));
  }

  getPersonEmailInput(): ElementFinder {
    return element(by.id('email'));
  }

  getCategoryNameInput(): ElementFinder {
    return element(by.css('input[formcontrolname="categoryName"]'));
  }

  getCategoryTree(): ElementArrayFinder {
    return element.all(by.css('.ant-tree-node-content-wrapper'));
  }

  getTags(): ElementArrayFinder {
    return element.all(by.css('nz-tag'))
  }

  getAllRussiaCheckbox(): ElementFinder {
    return element(by.css('.ant-modal-body .ant-checkbox-wrapper .ant-checkbox'));
  }

  getDeliverySaveBtn(): ElementFinder {
    return element(by.cssContainingText('.ant-modal-body button', 'Сохранить'));
  }

  getSaveBtn(): ElementFinder {
    return element(by.buttonText('Сохранить'))
  }

  getPriceListViewForm(): ElementFinder {
    return element(by.css('.price-list-view-form'));
  }

  getPriceListViewFormClose(): ElementFinder {
    return element(by.css('.ant-modal-close-x'));
  }

  getNotificationPriceListCreatedClose(): ElementFinder {
    return element(by.css('.ant-notification-notice-close-x'));
  }

  getInfoGroupValueElements(): ElementArrayFinder {
    return element.all(by.css('.info_group__value'));
  }

  getErrors(): ElementArrayFinder {
    return element.all(by.css('.ant-form-item-explain-error'));
  }

  getFormErrors(): ElementFinder {
    return element(by.css('.form-with-errors'));
  }

}
