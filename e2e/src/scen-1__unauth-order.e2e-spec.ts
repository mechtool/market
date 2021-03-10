import { browser, protractor } from 'protractor';
import { AppPage } from './scen-1__unauth-order.po';
import {
  until,
  navigateTo,
  randomItem,
  randomQuery,
  presenceOfAll,
  defaultTimeout,
  defaultOrganizationINN,
  defaultContactName,
  defaultContactPhone,
  defaultContactEmail,
  defaultDeliveryStreet,
  defaultDeliveryCity, restart, elementTextContentChanged, browserClick, defaultOrganizationKPP, defaultOrganizationName
} from './utils/utils';

let tradeOfferTitle = null;
let currentProductResultsText = null;

describe('Сценарий: Создание заказа от неавторизованного пользователя', async() => {
  const page = new AppPage();

  beforeAll(async() => {
    await restart();
    await navigateTo();
    await browser.waitForAngularEnabled(false);
  });

  describe('Пользователь выполняет поиск', async() => {
    unauthorizedUserSearches(page);
  });

  describe('Пользователь уточняет поиск с помощью выбора региона', async() => {
    unauthorizedUserSearchesWithRegion(page);
  });

  describe('Пользователь находит товар', async() => {
    unauthorizedUserFindsTradeOffer(page);
  });

  describe('Пользователь добавляет товар в корзину', async() => {
    unauthorizedUserAddsTradeOfferToCart(page);
  });

  describe('Пользователь создает заказ', async() => {
    unauthorizedUserMakesOrder(page);
  });
});


export function unauthorizedUserSearches(page: any) {

  it('Шаг 1: Пользователь заходит на главную страницу и видит пользовательское соглашение', async() => {
    await browser.wait(until.presenceOf(page.getCookieAgreement()), defaultTimeout);
  });

  it('Шаг 2: Пользователь соглашается с условиями пользовательского соглашения', async() => {
    await browser.wait(until.presenceOf(page.getCloseCookie()), defaultTimeout);
    await page.getCloseCookie().click();
  });

  it('Шаг 3: Пользователь видит поисковой бар с кнопками управления им', async() => {
    await browser.wait(until.presenceOf(page.getSearchBox()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchBoxInput()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchBoxButton()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchBoxFiltersButton()), defaultTimeout);
  });

  it('Шаг 4: Пользователь вводит поисковой запрос и нажимает на кнопку поиска', async() => {
    await page.getSearchBoxInput().sendKeys(randomQuery());
    await page.getSearchBoxButton().click();
  });

  it('Шаг 5: Пользователь видит результаты поиска', async() => {
    await browser.wait(until.presenceOf(page.getSearchResults()), defaultTimeout);
    await browser.wait(presenceOfAll(page.getAllProductCards()), defaultTimeout);
    currentProductResultsText = (await page.getSearchResults().getText());
  });

}

export function unauthorizedUserSearchesWithRegion(page: any) {

  it('Шаг 1: Пользователь видит панель фильтров и контрол "Выбор региона"', async() => {
    await browser.wait(until.presenceOf(page.getSearchFilterPanel()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchFilterPanelControlLocationInput()), defaultTimeout);
  });

  it('Шаг 2: Пользователь выбирает второй регион из предложенного списка', async() => {
    await page.getSearchFilterPanelControlLocationInput().sendKeys(protractor.Key.DOWN);
    await page.getSearchFilterPanelControlLocationInput().sendKeys(protractor.Key.ENTER);
  });

  it('Шаг 3: Пользователь видит изменившиеся результаты поиска', async() => {
    await elementTextContentChanged(page.getSearchResults(), currentProductResultsText);
    currentProductResultsText = await page.getSearchResults().getText();
  });

  it('Шаг 4: Пользователь вводит новый поисковой запрос и нажимает на кнопку поиска', async() => {
    const currentQuery = await page.getSearchBoxInput().getAttribute('value');
    await page.getSearchBoxInput().clear();
    await page.getSearchBoxInput().sendKeys(randomQuery(currentQuery));
    await page.getSearchBoxButton().click();
  });

  it('Шаг 5: Пользователь видит изменившиеся результаты поиска', async() => {
    await elementTextContentChanged(page.getSearchResults(), currentProductResultsText);
    currentProductResultsText = await page.getSearchResults().getText();
    await browser.wait(until.presenceOf(page.getAllProductCards()), defaultTimeout);
  });
}


export function unauthorizedUserFindsTradeOffer(page: any) {

  it('Шаг 1: Пользователь переходит в произвольно выбранный продукт', async() => {
    const productCards = await page.getAllProductCards();
    const index = productCards.length ? randomItem(productCards.length / 2) : 0;
    await browserClick(productCards[index].$('.cover'));
  });

  it('Шаг 2: Пользователь видит список торговых предложений', async() => {
    await browser.wait(until.presenceOf(page.getTradeOfferCounterTitle()), defaultTimeout);
    await browser.wait(until.textToBePresentInElement(page.getTradeOfferCounterTitle(), 'найдено'), defaultTimeout);
    await browser.wait(until.presenceOf(page.getTradeOfferCardList()), defaultTimeout);
    await browser.wait(presenceOfAll(page.getAllTradeOfferCards()), defaultTimeout);
  });

  it('Шаг 3: Пользователь переходит в произвольно выбранное торговое предложение', async() => {
    const tradeOfferCards = await page.getAllTradeOfferCards();
    const index = tradeOfferCards.length ? randomItem(tradeOfferCards.length / 2) : 0;
    await browserClick(tradeOfferCards[index].$('.catalog_item__pickup'));
  });

  it('Шаг 4: Пользователь видит описание торгового предложения', async() => {
    await browser.wait(until.presenceOf(page.getTradeOfferTitle()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getTradeOfferFeaturesTitle()), defaultTimeout);
    tradeOfferTitle = await page.getTradeOfferTitle().getText();
  });
}

export function unauthorizedUserAddsTradeOfferToCart(page: any) {
  let cartCounter = null;
  let cartPrice = null;

  it('Шаг 1: Пользователь видит блок добавления в корзину', async() => {
    await browser.wait(until.presenceOf(page.getCartBlock()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartBlockButton()), defaultTimeout);
    await browser.wait(until.stalenessOf(page.getCartBlockSwitcher()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartBlockPrice()), defaultTimeout);
    cartPrice = await page.getCartBlockPrice().getText();
  });

  it('Шаг 2: Пользователь нажимает на кнопку добавления к корзину', async() => {
    await page.getCartBlockButton().click();
  });

  it('Шаг 3: Пользователь видит кол-во товара и общую цену в Корзине', async() => {
    await browser.wait(until.presenceOf(page.getCartBlockSwitcher()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartBlockSwitcherInput()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartBlockSwitcherIncreaser()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartBlockSwitcherDecreaser()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartBlockPrice()), defaultTimeout);
    cartCounter = await page.getCartBlockSwitcherInput().getAttribute('value');
    const currentPrice = await page.getCartBlockPrice().getText();
    expect(cartPrice).toBe(currentPrice);
  });

  it('Шаг 4: Пользователь увеличивает кол-во товара в корзине управляющей кнопкой "+"', async() => {
    await page.getCartBlockSwitcherIncreaser().click();
  });

  it('Шаг 5: Пользователь видит изменения в кол-ве и общей цене товара', async() => {
    await browser.wait(until.presenceOf(page.getCartBlockPrice()), defaultTimeout);
    const currentCounter = await page.getCartBlockSwitcherInput().getAttribute('value');
    await elementTextContentChanged(page.getCartBlockPrice(), cartPrice);
    cartPrice = await page.getCartBlockPrice().getText();
    expect(cartCounter).not.toBe(currentCounter);
    cartCounter = currentCounter;
  });


  it('Шаг 6: Пользователь уменьшает кол-во товара в корзине управляющей кнопкой "-"', async() => {
    await page.getCartBlockSwitcherDecreaser().click();
  });

  it('Шаг 7: Пользователь видит изменения в кол-ве и общей цене товара', async() => {
    await browser.wait(until.presenceOf(page.getCartBlockPrice()), defaultTimeout);
    const currentCounter = await page.getCartBlockSwitcherInput().getAttribute('value');
    await elementTextContentChanged(page.getCartBlockPrice(), cartPrice);
    cartPrice = await page.getCartBlockPrice().getText();
    expect(cartCounter).not.toBe(currentCounter);
    cartCounter = currentCounter;
  });

  it('Шаг 8: Пользователь изменяет кол-во товара на 1000 шт вводом в поле', async() => {
    await page.getCartBlockSwitcherInput().sendKeys('1000');
    await page.getTradeOfferTitle().click();
  });

  it('Шаг 9: Пользователь видит изменения в кол-ве и общей цене товара', async() => {
    await browser.wait(until.presenceOf(page.getCartBlockPrice()), defaultTimeout);
    const currentCounter = await page.getCartBlockSwitcherInput().getAttribute('value');
    await elementTextContentChanged(page.getCartBlockPrice(), cartPrice);
    cartPrice = await page.getCartBlockPrice().getText();
    expect(cartCounter).not.toBe(currentCounter);
    cartCounter = currentCounter;
  });


}

export function unauthorizedUserMakesOrder(page: any) {

  it('Шаг 1: Пользователь переходит в Корзину', async() => {
    await page.getCartElement().click();
  });

  it('Шаг 2: Пользователь видит корзину и положенный в корзину товар', async() => {
    await browser.wait(until.presenceOf(page.getCartTitle()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderButton()), defaultTimeout);
    const productsWithSameTitle = await page.getCartProductsTitles().filter(async(title) => {
      return await title.getText() === tradeOfferTitle;
    })
    await expect(productsWithSameTitle.length).toBeGreaterThan(0)
  });

  it('Шаг 3: Пользователь нажимает на кнопку оформления заказа', async() => {
    await page.getCartMakeOrderButton().click();
  });

  it('Шаг 4: Пользователь видит модальное окно с выбором типа заказа', async() => {
    await browser.wait(until.presenceOf(page.getCartMakeOrderWithoutRegistrationButton()), defaultTimeout);
  });

  it('Шаг 5: Пользователь нажимает на кнопку заказа без регистрации', async() => {
    await page.getCartMakeOrderWithoutRegistrationButton().click();
  });

  it('Шаг 6: Пользователь видит форму для заполнения при заказе без регистрации', async() => {
    await browser.wait(until.presenceOf(page.getCartMakeOrderFillCustomerDataButton()), defaultTimeout);
  });

  it('Шаг 7: Пользователь нажимает на кнопку заполнения данных заказчика', async() => {
    await page.getCartMakeOrderFillCustomerDataButton().click();
  });

  it('Шаг 8: Пользователь видит модальное окно с возможностью ввода ИНН заказчика', async() => {
    await browser.wait(until.presenceOf(page.getRequisitesChecker()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getRequisitesCheckerInnInput()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getRequisitesCheckerButton()), defaultTimeout);
  });

  it('Шаг 9: Пользователь вводит данные по организации', async() => {
    await page.getRequisitesCheckerInnInput().sendKeys(defaultOrganizationINN);
    await page.getRequisitesCheckerButton().click();
    await browser.sleep(1e3);
    await page.getRequisitesCheckerKppInput().sendKeys(defaultOrganizationKPP);
    await page.getRequisitesCheckerKppInput().click();
    await browser.sleep(1e3);
    await page.getRequisitesCheckerNameInput().sendKeys(defaultOrganizationName);
    await page.getRequisitesCheckerNameInput().click();
    await browser.sleep(1e3);
  });

  it('Шаг 9: Пользователь видит модальное окно с заполненным наименованием организации', async() => {
    await browser.wait(until.presenceOf(page.getRequisitesCheckerNameInput()), defaultTimeout);
  });

  it('Шаг 10: Пользователь нажимает на кнопку сохранения данных о заказчике', async() => {
    await page.getRequisitesCheckerButton().click();
  });

  it('Шаг 11: Пользователь видит необходимые для дальнейшего заполнения контролы', async() => {
    await browser.wait(until.presenceOf(page.getDeliveryMethod()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderContactName()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderContactPhone()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderContactEmail()), defaultTimeout);
  });

  it('Шаг 12: Пользователь вводит свои ФИО, телефон и email', async() => {
    await page.getCartMakeOrderContactName().sendKeys(defaultContactName);
    await page.getCartMakeOrderContactPhone().sendKeys(defaultContactPhone);
    await page.getCartMakeOrderContactEmail().sendKeys(defaultContactEmail);
  });

  it('Шаг 13: Пользователь вводит адрес доставки (если необходимо)', async() => {
    const deliveryMethod = await page.getDeliveryMethod().getText();
    if (deliveryMethod.toLowerCase() === 'доставка') {
      await browser.wait(until.presenceOf(page.getDeliveryCity()), defaultTimeout);
      await browser.wait(until.presenceOf(page.getDeliveryStreet()), defaultTimeout);
      await page.getDeliveryCity().clear();
      await page.getDeliveryCity().sendKeys(defaultDeliveryCity);
      await browser.sleep(3e3);
      await page.getDeliveryCity().sendKeys(protractor.Key.ENTER);
      await browser.sleep(1e3);
      await page.getDeliveryStreet().sendKeys(defaultDeliveryStreet);
      await browser.sleep(3e3);
      await page.getDeliveryStreet().sendKeys(protractor.Key.ENTER);
      await browser.sleep(3e3);
    }
  });

  it('Шаг 14: Пользователь нажимает на кнопку оформления заказа', async() => {
    await page.getCartMakeOrderButton().click();
  });

  it('Шаг 15: Пользователь видит модальное окно с сообщением об отправке заказа', async() => {
    await browser.wait(until.presenceOf(page.getModalOrderSent()), defaultTimeout);
  });

  it('Шаг 16: Пользователь нажимает на кнопку оформления заказа', async() => {
    await browser.wait(until.presenceOf(page.getCartMakeOrderButton()), defaultTimeout);
    await browserClick(await page.getCartMakeOrderButton());
  });

  it('Шаг 17: Пользователь видит модальное окно с сообщением об отправке заказа', async() => {
    await browser.wait(until.presenceOf(page.getModalOrderSent()), defaultTimeout);
  });
}
