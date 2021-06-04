import { browser, by, element, protractor } from 'protractor';
import { AppPage } from './scen-1__unauth-order.po';
import {
  browserClick,
  defaultCommentForSupplier,
  defaultContactEmail,
  defaultContactName,
  defaultContactPhone,
  defaultDeliveryCity,
  defaultOrganizationINN,
  defaultTimeout,
  elementTextContentChanged,
  navigateTo,
  presenceOfAll,
  randomItem,
  randomQuery,
  restart,
  until,
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


export function unauthorizedUserSearches(page: AppPage) {

  it('Шаг 1: Пользователь заходит на главную страницу и видит пользовательское соглашение', async() => {
    await browser.wait(until.presenceOf(page.getCookieAgreement()), defaultTimeout);
  });

  it('Шаг 2: Пользователь соглашается с условиями пользовательского соглашения', async() => {
    await browser.wait(until.presenceOf(page.getCloseCookie()), defaultTimeout);
    await page.getCloseCookie().click();
  });

  it('Шаг 3: Пользователь видит уведомление с запросом о его регионе', async() => {
    await browser.wait(until.presenceOf(page.getRegionNotification()), defaultTimeout);
  });

  it('Шаг 4: Пользователь закрывает уведомление с запросом о его регионе', async() => {
    await browser.wait(until.presenceOf(page.getCloseRegionNotification()), defaultTimeout);
    await page.getCloseRegionNotification().click();
  });

  it('Шаг 5: Пользователь видит поисковой бар с кнопками управления им', async() => {
    await browser.wait(until.presenceOf(page.getSearchBox()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchBoxInput()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchBoxButton()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchBoxFiltersButton()), defaultTimeout);
  });

  it('Шаг 6: Пользователь вводит поисковой запрос и нажимает на кнопку поиска', async() => {
    await page.getSearchBoxInput().sendKeys(randomQuery());
    await page.getSearchBoxButton().click();
  });

  it('Шаг 7: Пользователь видит результаты поиска', async() => {
    await browser.wait(until.presenceOf(page.getSearchResults()), defaultTimeout);
    await browser.wait(presenceOfAll(page.getAllProductCards()), defaultTimeout);
    currentProductResultsText = (await page.getSearchResults().getText());
  });

}

export function unauthorizedUserSearchesWithRegion(page: AppPage) {

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
    await page.getSearchBoxInput().clear();
    await page.getSearchBoxInput().sendKeys(randomQuery(true));
    await page.getSearchBoxButton().click();
  });

  it('Шаг 5: Пользователь видит изменившиеся результаты поиска', async() => {
    await elementTextContentChanged(page.getSearchResults(), currentProductResultsText);
    currentProductResultsText = await page.getSearchResults().getText();
    await browser.wait(presenceOfAll(page.getAllProductCards()), defaultTimeout);
  });
}


export function unauthorizedUserFindsTradeOffer(page: AppPage) {

  it('Шаг 1: Пользователь переходит в произвольно выбранный продукт', async() => {
    const productCards = await page.getAllProductCards();
    const index = randomItem(4);

    console.log('\t------------------------------->');
    console.log(`\tВсего найдено ${productCards.length} шт.`);
    console.log(`\tВыбран ${index} товар`)
    console.log('\t------------------------------->');

    await browser.sleep(5e3);
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

    console.log('\t------------------------------->');
    console.log(`\tВсего торговых предложений найдено ${tradeOfferCards.length} шт.`);
    console.log('\t------------------------------->');

    await browser.sleep(5e3);
    await browserClick(tradeOfferCards[0].$('.catalog_item__pickup'));
  });

  it('Шаг 4: Пользователь видит описание торгового предложения', async() => {
    await browser.wait(until.presenceOf(page.getTradeOfferTitle()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getTradeOfferFeaturesTitle()), defaultTimeout);
    tradeOfferTitle = await page.getTradeOfferTitle().getText();
  });
}

export function unauthorizedUserAddsTradeOfferToCart(page: AppPage) {
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
    const currentCounter = await browser.executeScript('return arguments[0].value', page.getCartBlockSwitcherInput());
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
    const currentCounter = await browser.executeScript('return arguments[0].value', page.getCartBlockSwitcherInput());
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
    const currentCounter = await browser.executeScript('return arguments[0].value', page.getCartBlockSwitcherInput());
    await elementTextContentChanged(page.getCartBlockPrice(), cartPrice);
    cartPrice = await page.getCartBlockPrice().getText();
    expect(cartCounter).not.toBe(currentCounter);
    cartCounter = currentCounter;
  });
}

export function unauthorizedUserMakesOrder(page: AppPage) {

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

  it('Шаг 4: Пользователь видит форму для заполнения при заказе без регистрации', async() => {
    await browser.wait(until.presenceOf(page.getOrderingWithoutRegistrationForm()), defaultTimeout);
  });

  it('Шаг 5: Пользователь видит поле с возможностью ввода ИНН заказчика и кнопку "Войти через "1С:ИТС""', async() => {
    await browser.wait(until.presenceOf(page.getRequisitesCheckerInnInput()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getAuth1CITSButton()), defaultTimeout);
  });

  it('Шаг 6: Пользователь вводит данные ИНН организации', async() => {
    await page.getRequisitesCheckerInnInput().sendKeys(defaultOrganizationINN);
    await browser.sleep(1e3);
  });

  it('Шаг 7: Пользователь видит появившиеся, заполненые поля КПП и наименования организации', async() => {
    await browser.wait(until.presenceOf(page.getRequisitesCheckerKppInput()), defaultTimeout);
    await expect(page.getRequisitesCheckerKppInput().isPresent()).toBeTruthy();
    await browser.wait(until.presenceOf(page.getRequisitesCheckerNameInput()), defaultTimeout);
    await expect(page.getRequisitesCheckerNameInput().isPresent()).toBeTruthy();
  });

  it('Шаг 8: Пользователь видит необходимые для дальнейшего заполнения контролы', async() => {
    await browser.wait(until.presenceOf(page.getCartMakeOrderContactName()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderContactPhone()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderContactEmail()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getDeliveryMethod()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderCommentForSupplier()), defaultTimeout);
  });

  it('Шаг 9: Пользователь вводит свои ФИО, телефон и email', async() => {
    await page.getCartMakeOrderContactName().sendKeys(defaultContactName);
    await page.getCartMakeOrderContactPhone().sendKeys(defaultContactPhone);
    await page.getCartMakeOrderContactEmail().sendKeys(defaultContactEmail);
  });

  it('Шаг 10: Пользователь вводит адрес доставки (если необходимо)', async() => {
    const deliveryMethod = await page.getDeliveryMethod().getText();
    if (deliveryMethod.toLowerCase() === 'доставка') {
      await browser.wait(until.presenceOf(page.getDeliveryCityInput()), defaultTimeout);
      await page.getDeliveryCityInput().clear();
      await page.getDeliveryCityInput().sendKeys(defaultDeliveryCity);
      await browser.sleep(3e3);
      await page.getDeliveryCityInput().sendKeys(protractor.Key.ENTER);
      await browser.sleep(1e3);
    }
  });

  it('Шаг 11: Пользователь вводит комментарий для поставщика', async() => {
    await page.getCartMakeOrderCommentForSupplier().sendKeys(defaultCommentForSupplier);
  });

  it('Шаг 12: Пользователь соглашается с тем, что являюсь уполномоченным представителем регистрируемой организации', async() => {
    await browser.wait(until.presenceOf(page.getIsOrganizationAgent()), defaultTimeout);
    await browserClick(page.getIsOrganizationAgent());
    await browser.sleep(1e3);
  });

  it('Шаг 13: Пользователь перепроверяет какие значения указал', async() => {
    console.log('\t------------------------------->');

    await browser.executeScript('return arguments[0].value', page.getRequisitesCheckerInnInput())
      .then((res) => {
        console.log('\tИНН:', res);
      });

    await browser.executeScript('return arguments[0].value', page.getRequisitesCheckerKppInput())
      .then((res) => {
        console.log('\tКПП:', res);
      });

    await browser.executeScript('return arguments[0].value', page.getRequisitesCheckerNameInput())
      .then((res) => {
        console.log('\tНазвание организации:', res);
      });

    await browser.executeScript('return arguments[0].value', page.getCartMakeOrderContactName())
      .then((res) => {
        console.log('\tКонтактное лицо:', res);
      });

    await browser.executeScript('return arguments[0].value', page.getCartMakeOrderContactPhone())
      .then((res) => {
        console.log('\tТелефон:', res);
      });

    await browser.executeScript('return arguments[0].value', page.getCartMakeOrderContactEmail())
      .then((res) => {
        console.log('\tE-mail:', res);
      });

    await page.getDeliveryMethod().getText()
      .then((res) => {
        console.log('\tВыберите предпочтительный способ поставки из предлагаемых:', res);
      });

    await page.getDeliveryCitySelect().isPresent()
      .then((isPresent) => {
        if (isPresent) {
          page.getDeliveryCitySelect().getText()
            .then((res) => {
              console.log('\tВыберите склад самовывоза:', res);
            });
        }
      });

    await page.getDeliveryCityInput().isPresent()
      .then((isPresent) => {
        if (isPresent) {
          browser.executeScript('return arguments[0].value', page.getDeliveryCityInput())
            .then((res) => {
              console.log('\tУкажите населенный пункт доставки:', res);
            });
        }
      });

    await browser.executeScript('return arguments[0].value', page.getCartMakeOrderCommentForSupplier())
      .then((res) => {
        console.log('\tКомментарий для поставщика:', res);
      });

    await page.getErrors().isPresent()
      .then((isPresent) => {
        console.log('\tОшибки при заполнении:', `${isPresent ? 'ДА' : 'НЕТ'}`);

        if (isPresent) {
          page.getErrors().getText()
            .then((err) => {
              console.log('\tОшибки:', err);
            });
        }
      });

    await page.getInputErrors().isPresent()
      .then((isPresent) => {
        console.log('\tВсе поля заполнены:', `${isPresent ? 'НЕТ' : 'ДА'}`);
      });

    await page.getTermsOfUseError().isPresent()
      .then((isPresent) => {
        console.log('\tПринял пользовательское соглашение:', `${isPresent ? 'НЕТ' : 'ДА'}`);
      });

    await page.getFormErrors().isPresent()
      .then((isPresent) => {
        console.log('\tФорма заполнена с ошибками:', `${isPresent ? 'ДА' : 'НЕТ'}`);
      });

    console.log('\t------------------------------->');
  });

  it('Шаг 14: Пользователь нажимает на кнопку оформления заказа', async() => {
    await browser.wait(until.presenceOf(page.getCartMakeOrderButton()), defaultTimeout);

    await page.getCartMakeOrderButton().isEnabled()
      .then((isEnabled) => {
        console.log('\tКнопка заказа активна:', `${isEnabled ? 'ДА' : 'НЕТ'}`);
      });

    await page.getCartMakeOrderButton().getText()
      .then((text) => {
        console.log('\tНа кнопке написано:', text);
      });

    await browser.executeScript("arguments[0].scrollIntoView(true);", page.getCartMakeOrderButton());
    await browser.executeScript("arguments[0].click();", page.getCartMakeOrderButton());

    // await page.getCartMakeOrderButton().click();
    // await browser.findElement(by.buttonText('Оформить заказ')).click(); // NOT WORKS
    // await browserClick(page.getCartMakeOrderButton()); // WORKS
  });

  it('Шаг 15: Пользователь видит модальное окно с сообщением об отправке заказа', async() => {
    await browser.sleep(5e3);
    await browser.wait(until.presenceOf(page.getModalOrderSent()), defaultTimeout);
  });

}
