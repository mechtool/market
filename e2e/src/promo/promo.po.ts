import { by, element, ElementArrayFinder, ElementFinder } from 'protractor';

export class PromoPage {

  getTitleElement(): ElementFinder {
    return element(by.cssContainingText('.pages h2', 'Текущие акции'));
  }

}
