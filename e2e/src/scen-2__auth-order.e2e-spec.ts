import { browser, by, protractor } from 'protractor';
import { AppPage } from './scen-2__auth-order.po';
import { LoginItsPage, userLoginWithAvailableOrganizations, userPassword } from './login-its/login-its.po';
import {
  browserClick,
  defaultCommentForSupplier,
  defaultContactEmail,
  defaultContactName,
  defaultContactPhone,
  defaultDeliveryCity,
  defaultDeliveryHouse,
  defaultDeliveryStreet,
  defaultSupplierNameINN,
  defaultTimeout,
  elementTextContentChanged,
  navigateTo,
  presenceOfAll,
  randomItem,
  restart,
  until
} from './utils/utils';

let tradeOfferTitle = null;
let currentProductResultsText = null;
let windowHandles = null;

describe('Сценарий: Создание заказа от авторизованного пользователя (у которого есть организации)', async() => {
  const page = new AppPage();
  const loginPage = new LoginItsPage();

  beforeAll(async() => {
    await restart();
    await navigateTo();
    await browser.waitForAngularEnabled(false);
  });

  describe('Пользователь авторизуется в приложении', async() => {
    authorizedUserAuths(page, loginPage);
  });

  describe('Пользователь выполняет поиск', async() => {
    authorizedUserSearches(page);
  });

  describe('Пользователь уточняет поиск с помощью выбора региона и поставщика', async() => {
    authorizedUserSearchesWithRegion(page);
  });

  describe('Пользователь находит товар', async() => {
    authorizedUserFindsTradeOffer(page);
  });

  describe('Пользователь добавляет товар в корзину', async() => {
    authorizedUserAddsTradeOfferToCart(page);
  });

  describe('Пользователь создает заказ', async() => {
    authorizedUserMakesOrder(page);
  });

});


export function authorizedUserAuths(page: AppPage, loginPage: LoginItsPage) {

  it('Шаг 1: Пользователь видит кнопку "Войти"', async() => {
    await browser.wait(until.presenceOf(page.getLoginElement()), defaultTimeout);
  });

  it('Шаг 2: Пользователь нажимает на кнопку "Войти"', async() => {
    await page.getLoginElement().click();
  });

  it('Шаг 3: Пользователь видит модальное окно для авторизации', async() => {
    await browser.wait(() => {
      return browser.getAllWindowHandles().then((handles) => {
        windowHandles = handles;
        if (handles.length > 1) {
          return true;
        }
      });
    }, 10000);

    await browser.switchTo().window(windowHandles[1]);
    await browser.wait(until.presenceOf(loginPage.getLoginInput()), defaultTimeout);
    await browser.wait(until.presenceOf(loginPage.getPasswordInput()), defaultTimeout);
    await browser.wait(until.presenceOf(loginPage.getLoginButton()), defaultTimeout);
  });

  it('Шаг 4: Пользователь авторизуется', async() => {
    await loginPage.getLoginInput().sendKeys(userLoginWithAvailableOrganizations);
    await loginPage.getPasswordInput().sendKeys(userPassword);
    await loginPage.getLoginButton().click();
  });

  it('Шаг 5: Пользователь видит кнопку "Мои заказы"', async() => {
    await browser.switchTo().window(windowHandles[0]);
    windowHandles = null;
    await browser.wait(until.presenceOf(page.getMyOrdersElement()), defaultTimeout);
  });

}

export function authorizedUserSearches(page: AppPage) {

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

  it('Шаг 4: Пользователь соглашается с определенным регионом и нажимает кнопку "Да, все верно"', async() => {
    await browser.wait(until.presenceOf(page.getAcceptRegionNotification()), defaultTimeout);
    await page.getAcceptRegionNotification().click();
  });

  it('Шаг 5: Пользователь видит поисковой бар с кнопками управления им', async() => {
    await browser.wait(until.presenceOf(page.getSearchBox()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchBoxInput()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchBoxButton()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchBoxFiltersButton()), defaultTimeout);
  });

  it('Шаг 6: Пользователь нажимает на кнопку поиска', async() => {
    await page.getSearchBoxButton().click();
  });

  it('Шаг 7: Пользователь видит результаты поиска', async() => {
    await browser.wait(presenceOfAll(page.getAllProductCards()), defaultTimeout);
  });
}

export function authorizedUserSearchesWithRegion(page: AppPage) {

  it('Шаг 1: Пользователь видит панель фильтров и контролы "Выбор региона" и "Выбор поставщика"', async() => {
    await browser.wait(until.presenceOf(page.getSearchFilterPanel()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchFilterPanelControlLocationInput()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getSearchFilterPanelControlSupplierInput()), defaultTimeout);
  });

  it('Шаг 2: Пользователь вводит регион и ИНН поставщика, выбирая варианты из предложенного списка', async() => {
    await browser.sleep(2e3);
    await page.getSearchFilterPanelControlLocationInput().clear();
    await page.getSearchFilterPanelControlLocationInput().sendKeys(defaultDeliveryCity);
    await browser.sleep(1e3);
    await page.getSearchFilterPanelControlLocationInput().sendKeys(protractor.Key.DOWN);
    await page.getSearchFilterPanelControlLocationInput().sendKeys(protractor.Key.ENTER);

    await browser.sleep(1e3);
    await page.getSearchFilterPanelControlSupplierInput().sendKeys(defaultSupplierNameINN);
    await browser.sleep(2e3);
    await page.getSearchFilterPanelControlSupplierInput().sendKeys(protractor.Key.DOWN);
    await page.getSearchFilterPanelControlSupplierInput().sendKeys(protractor.Key.ENTER);
  });

  it('Шаг 3: Пользователь видит результаты поиска', async() => {
    await browser.wait(until.textToBePresentInElement(page.getSearchResultsTitle(), 'найдено '), defaultTimeout);
    await elementTextContentChanged(page.getSearchResults(), currentProductResultsText);
  });
}

export function authorizedUserFindsTradeOffer(page: AppPage) {

  it('Шаг 1: Пользователь переходит в произвольно выбранный продукт', async() => {
    const productCards = await page.getAllProductCards();
    const index = randomItem(4);

    console.log('\t------------------------------->');
    console.log(`\tВсего товаров найдено ${productCards.length} шт.`);
    console.log(`\tВыбран ${index} товар`)
    console.log('\t------------------------------->');

    await browser.sleep(5e3);
    await browserClick(productCards[index].$('.cover'));
  });

  it('Шаг 2: Пользователь видит список торговых предложений', async() => {
    await browser.wait(until.presenceOf(page.getTradeOfferCounterTitle()), defaultTimeout);
    await browser.wait(until.textToBePresentInElement(page.getTradeOfferCounterTitle(), 'найдено '), defaultTimeout);
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

export function authorizedUserAddsTradeOfferToCart(page: AppPage) {
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
    const currentCounter = await browser.executeScript('return arguments[0].value', page.getCartBlockSwitcherInput())
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
    const currentCounter = await browser.executeScript('return arguments[0].value', page.getCartBlockSwitcherInput())
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
    const currentCounter = await browser.executeScript('return arguments[0].value', page.getCartBlockSwitcherInput())
    await elementTextContentChanged(page.getCartBlockPrice(), cartPrice);
    cartPrice = await page.getCartBlockPrice().getText();
    expect(cartCounter).not.toBe(currentCounter);
    cartCounter = currentCounter;
  });

}

export async function authorizedUserMakesOrder(page: AppPage) {

  it('Шаг 1: Пользователь переходит в Корзину', async() => {
    await page.getCartElement().click();
  });

  it('Шаг 2: Пользователь видит корзину и положенный в корзину товар', async() => {
    await browser.wait(until.presenceOf(page.getCartTitle()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderButton()), defaultTimeout);
    const productsWithSameTitle = await page.getCartProductsTitles().filter(async(title) => {
      return await title.getText() === tradeOfferTitle;
    })
    await expect(productsWithSameTitle.length).toBeGreaterThan(0);
  });

  it('Шаг 3: Пользователь нажимает на кнопку оформления заказа', async() => {
    await page.getCartMakeOrderButton().click();
  });

  it('Шаг 4: Пользователь видит необходимые для дальнейшего заполнения поля', async() => {
    await browser.wait(until.presenceOf(page.getDeliveryMethod()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderContactName()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderContactPhone()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderContactEmail()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getCartMakeOrderCommentForSupplier()), defaultTimeout);
  });

  it('Шаг 5: Пользователь вводит адрес доставки', async() => {
    const deliveryMethod = await page.getDeliveryMethod().getText();

    if (deliveryMethod.toLowerCase() === 'самовывоз') {
      await page.getDelivery().click();
      await browser.sleep(2e3);
    }

    await browser.wait(until.presenceOf(page.getDeliveryCityInput()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getDeliveryStreetInput()), defaultTimeout);
    await browser.wait(until.presenceOf(page.getDeliveryHouseInput()), defaultTimeout);

    await browser.sleep(1e3);

    await page.getDeliveryCityInput().clear();
    await browser.sleep(1e3);
    await page.getDeliveryCityInput().sendKeys(defaultDeliveryCity);
    await browser.sleep(2e3);
    await page.getDeliveryCityInput().sendKeys(protractor.Key.DOWN);
    await page.getDeliveryCityInput().sendKeys(protractor.Key.ENTER);
    await browser.sleep(2e3);

    await page.getDeliveryStreetInput().sendKeys(defaultDeliveryStreet);
    await browser.sleep(1e3);
    await page.getDeliveryStreetInput().sendKeys(protractor.Key.DOWN);
    await page.getDeliveryStreetInput().sendKeys(protractor.Key.ENTER);
    await browser.sleep(2e3);

    await page.getDeliveryHouseInput().sendKeys(defaultDeliveryHouse);
    await browser.sleep(1e3);
    await page.getDeliveryHouseInput().sendKeys(protractor.Key.DOWN);
    await page.getDeliveryHouseInput().sendKeys(protractor.Key.ENTER);
    await browser.sleep(2e3);

    expect(page.getDeliveryCityInput().getAttribute('value')).toEqual(defaultDeliveryCity);
  });

  it('Шаг 6: Пользователь вводит свои ФИО, телефон и email', async() => {
    await page.getCartMakeOrderContactName().clear();
    await browser.sleep(1e3);
    await page.getCartMakeOrderContactName().sendKeys(defaultContactName);
    await browser.sleep(1e3);
    await page.getCartMakeOrderContactPhone().clear();
    await browser.sleep(1e3);
    await page.getCartMakeOrderContactPhone().sendKeys(defaultContactPhone);
    await browser.sleep(1e3);
    await page.getCartMakeOrderContactEmail().clear();
    await browser.sleep(1e3);
    await page.getCartMakeOrderContactEmail().sendKeys(defaultContactEmail);
  });

  it('Шаг 7: Пользователь вводит комментарий для поставщика', async() => {
    await browser.sleep(1e3);
    await page.getCartMakeOrderCommentForSupplier().sendKeys(defaultCommentForSupplier);
  });

  it('Шаг 8: Пользователь перепроверяет какие значения указал', async() => {
    console.log('\t------------------------------->');

    await page.getCustomerSelect().getText()
      .then((res) => {
        console.log('\tЗаказчик:', res);
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
              console.log('\tГород:', res);
            });

          browser.executeScript('return arguments[0].value', page.getDeliveryStreetInput())
            .then((res) => {
              console.log('\tУлица:', res);
            });

          browser.executeScript('return arguments[0].value', page.getDeliveryHouseInput())
            .then((res) => {
              console.log('\tДом:', res);
            });
        }
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

    await page.getFormErrors().isPresent()
      .then((isPresent) => {
        console.log('\tФорма заполнена с ошибками:', `${isPresent ? 'ДА' : 'НЕТ'}`);
      });

    console.log('\t------------------------------->');
  });

  it('Шаг 9: Пользователь нажимает на кнопку оформления заказа', async() => {
    await browser.wait(until.presenceOf(page.getCartMakeOrderButton()), defaultTimeout);

    await page.getCartMakeOrderButton().isEnabled()
      .then((isEnabled) => {
        console.log('\tКнопка заказа активна:', `${isEnabled ? 'ДА' : 'НЕТ'}`);
      });

    await page.getCartMakeOrderButton().getText()
      .then((text) => {
        console.log('\tНа кнопке написано:', text);
      });

    // await browser.findElement(by.buttonText('Оформить заказ')).click();

    await browser.executeScript("arguments[0].scrollIntoView(true);", page.getCartMakeOrderButton());
    await page.getCartMakeOrderButton().click();
  });

  it('Шаг 10: Пользователь видит модальное окно с сообщением об отправке заказа', async() => {
    await browser.sleep(5e3);
    await browser.wait(until.presenceOf(page.getModalOrderSent()), defaultTimeout);
  });
}
