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

  getMyRequestsElement(): ElementFinder {
    return element(by.cssContainingText('li', 'Мои запросы'));
  }

  getRFPTableElement(): ElementFinder {
    return element(by.css('market-rfp-list'));
  }

  getOfferTableElement(): ElementFinder {
    return element(by.css('market-offer-list'));
  }

  getRequestForProposalTabElement(): ElementFinder {
    return element(by.cssContainingText('.ant-tabs-tab', 'Запросы коммерческих предложений'));
  }

  getCommercialOffersTabElement(): ElementFinder {
    return element(by.cssContainingText('.ant-tabs-tab', 'Коммерческие предложения'));
  }

  getCreateRFPBtnElement(): ElementFinder {
    return element(by.buttonText('Создать'));
  }

  getRFPCreatingFormElement(): ElementFinder {
    return element(by.css('market-rfp-edit-component'));
  }

  getPersonNameInput(): ElementFinder {
    return element(by.id('contactName'));
  }

  getPersonPhoneInput(): ElementFinder {
    return element(by.id('contactPhone'));
  }

  getPersonEmailInput(): ElementFinder {
    return element(by.id('contactEmail'));
  }

  geDatePickers(): ElementArrayFinder {
    return element.all(by.css('nz-date-picker'));
  }

  getDatePickerCollectingFrom(): ElementFinder {
    return this.geDatePickers().first();
  }

  getDatePickerCollectingTo(): ElementFinder {
    return this.geDatePickers().get(1);
  }

  getDatePickerConsideringTo(): ElementFinder {
    return this.geDatePickers().get(2);
  }

  getNextMonth(): ElementFinder {
    return element(by.css('.ant-picker-next-icon'))
  }

  getDates(): ElementArrayFinder {
    return element.all(by.css('.ant-picker-cell .ant-picker-cell-inner'));
  }

  getPosition1ProductNameInput(): ElementFinder {
    return element(by.id('productCustomerSpecificationProductName_0'));
  }

  getPosition2ProductNameInput(): ElementFinder {
    return element(by.id('productCustomerSpecificationProductName_1'));
  }

  getPosition1ProductDescriptionInput(): ElementFinder {
    return element(by.id('productCustomerSpecificationProductDescription_0'));
  }

  getPosition2ProductDescriptionInput(): ElementFinder {
    return element(by.id('productCustomerSpecificationProductDescription_1'));
  }

  getPosition1ProductPartNumberInput(): ElementFinder {
    return element(by.id('productCustomerSpecificationPartNumber_0'));
  }

  getPosition2ProductPartNumberInput(): ElementFinder {
    return element(by.id('productCustomerSpecificationPartNumber_1'));
  }

  getPosition1ProductQuantityInput(): ElementFinder {
    return element(by.id('purchaseConditionsNumberOfPackages_0'));
  }

  getPosition2ProductQuantityInput(): ElementFinder {
    return element(by.id('purchaseConditionsNumberOfPackages_1'));
  }

  getPosition1ProductMaxPriceInput(): ElementFinder {
    return element(by.id('purchaseConditionsMaxPrice_0'));
  }

  getPosition2ProductMaxPriceInput(): ElementFinder {
    return element(by.id('purchaseConditionsMaxPrice_1'));
  }

  getPosition1DatePickerDesiredDelivery(): ElementFinder {
    return this.geDatePickers().last();
  }

  getNewPosition(): ElementFinder {
    return element.all(by.css('nz-tag')).last();
  }

  getPositionRemover(): ElementArrayFinder {
    return element.all(by.css('.position__item__remover'));
  }

  getSaveBtn(): ElementFinder {
    return element(by.buttonText('Сохранить'))
  }

  getErrors(): ElementArrayFinder {
    return element.all(by.css('.ant-form-item-explain-error'));
  }

  getFormErrors(): ElementFinder {
    return element(by.css('.form-with-errors'));
  }

  getRFPRows(): ElementArrayFinder {
    return element.all(by.css('.table_row'));
  }

  getActualRFPRows(): ElementArrayFinder {
    return element.all(by.css('div[data-title="Статус:"]')).filter((elem) => {
      return elem.getText().then((text) => {
        return !text.includes('Отменен');
      });
    });
  }

  getRFPViewForm(): ElementFinder {
    return element(by.css('.rv'));
  }

  getRFPViewFormClose(): ElementFinder {
    return element(by.css('.ant-modal-close-x'));
  }

  getInfoGroupValueElements(): ElementArrayFinder {
    return element.all(by.css('.info_group__multi-item_item__value'));
  }

  getEditRFPBtn(): ElementFinder {
    return this.getRFPRows().get(1).element(by.css('button[nztooltiptitle="Редактировать"]'));
  }

  getCancelRFPBtn(): ElementFinder {
    return this.getRFPRows().get(1).element(by.css('button[nztooltiptitle="Отменить"]'));
  }

  getCancelRFPOkBtn(): ElementFinder {
    return element(by.buttonText('OK'));
  }

}
