import { AppPage } from './scen-4__my-sales.po';
import { LoginItsPage, userLoginForMySales, userPassword } from './login-its/login-its.po';
import {
  browserClick,
  defaultContactEmail,
  defaultContactName,
  defaultContactPhone,
  defaultPriceListExternalUrl,
  defaultTimeout,
  navigateTo,
  presenceOfAll,
  randomItem,
  restart,
  until
} from './utils/utils';
import { browser } from 'protractor';

let windowHandles = null;


describe('Сценарий: Работа с разделом сайта "Мои продажи". Загрузка, изменение и удаление прайс-листа.', async() => {
  const page = new AppPage();
  const loginPage = new LoginItsPage();

  beforeAll(async() => {
    await restart();
    await navigateTo();
    await browser.waitForAngularEnabled(false);
  });

  describe('Пользователь авторизуется в приложении', async() => {
    userAuthenticated(page, loginPage);
  });

  describe('Пользователь изучает раздел сайта "Мои продажи"', async() => {
    authorizedUserExaminesMySales(page);
  });

  describe('Пользователь заружает новый прайс-лист', async() => {
    authorizedUserUploadingNewPriceList(page);
  });

  describe('Пользователь просматривает загруженный прайс-лист', async() => {
    authorizedUserViewsUploadedPriceList(page);
  });

  describe('Пользователь редактирует прайс-лист', async() => {
    authorizedUserEditingPriceList(page);
  });

  describe('Пользователь просматривает отредактированный прайс-лист', async() => {
    authorizedUserViewsEditedPriceList(page);
  });

  describe('Пользователь выполняет настройку рубрикации товаров прайс-листа', async() => {
    authorizedUserConfiguresProductCategoryPriceList(page);
  });

  describe('Пользователь переходит в магазин поставщика', async() => {
    authorizedUserGoesToSupplierStore(page);
  });

  describe('Пользователь удаляет прайс-лист', async() => {
    authorizedUserDeletesPriceList(page);
  });

});

export function userAuthenticated(page: AppPage, loginPage: LoginItsPage) {

  it('Шаг 1: Пользователь видит раздел меню "Войти"', async() => {
    await browser.wait(until.presenceOf(page.getLoginElement()), defaultTimeout);
  });

  it('Шаг 2: Пользователь нажимает на раздел меню "Войти"', async() => {
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
    }, defaultTimeout);

    await browser.switchTo().window(windowHandles[1]);
    await browser.wait(until.presenceOf(loginPage.getLoginInput()), defaultTimeout);
    await browser.wait(until.presenceOf(loginPage.getPasswordInput()), defaultTimeout);
    await browser.wait(until.presenceOf(loginPage.getLoginButton()), defaultTimeout);
  });

  it('Шаг 4: Пользователь авторизуется', async() => {
    await loginPage.getLoginInput().sendKeys(userLoginForMySales);
    await loginPage.getPasswordInput().sendKeys(userPassword);
    await loginPage.getLoginButton().click();
  });

  it('Шаг 5: Пользователь видит раздел меню "Мои продажи"', async() => {
    await browser.switchTo().window(windowHandles[0]);
    windowHandles = null;
    await browser.wait(until.presenceOf(page.getMySalesElement()), defaultTimeout);
  });

}

export function authorizedUserExaminesMySales(page: AppPage) {

  it('Шаг 1: Пользователь на главной странице и видит пользовательское соглашение', async() => {
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

  it('Шаг 5: Пользователь переходит в раздел сайта "Мои продажи"', async() => {
    await browser.wait(until.presenceOf(page.getMySalesElement()), defaultTimeout);
    await page.getMySalesElement().click();
  });

  it('Шаг 6: Пользователь видит подраздел "Мои прайс-листы"', async() => {
    await browser.wait(until.presenceOf(page.getPriceListTableElement()), defaultTimeout);
  });

  it('Шаг 7: Пользователь переходит в подраздел "Заказы покупателей"', async() => {
    await page.getCustomerOrdersElement().click();
    await browser.wait(until.presenceOf(page.getOrderListTableElement()), defaultTimeout);
  });

  it('Шаг 8: Пользователь переходит в подраздел "Настройка рубрикации"', async() => {
    await page.getCategoriesSettingElement().click();
    await browser.wait(until.presenceOf(page.getCategoriesSettingTableElement()), defaultTimeout);
  });
}

export function authorizedUserUploadingNewPriceList(page: AppPage) {

  it('Шаг 1: Пользователь возвращается в подраздел "Мои прайс-листы"', async() => {
    await page.getMyPriceListElement().click();
  });

  it('Шаг 2: Пользователь нажимает на кнопку "Загрузить прайс-лист"', async() => {
    await browser.wait(until.presenceOf(page.getUploadNewPriceListBtnElement()), defaultTimeout);
    await page.getUploadNewPriceListBtnElement().click();
  });

  it('Шаг 3: Пользователь видит форму для загрузки прайс-листа', async() => {
    await browser.wait(until.presenceOf(page.getPriceListCreatingFormElement()), defaultTimeout);
  });

  it('Шаг 4: Пользователь ознакамливается с правилами загрузки прайс-листа и скачивает шаблон excel-файла', async() => {
    await browser.wait(until.presenceOf(page.getPriceListCreatingManualElement()), defaultTimeout);
    await page.getExcelFileTemplateElement().click();
    // todo Пока отключил проверку, что файл скачался. Не работает при отключенном браузере. Либо переписать проверку, либо рабобраться
    // await browser.sleep(1e3)
    // await navigateTo('chrome://downloads/');
    // const elementWithText = await browser.executeScript('return document.querySelector(\'downloads-manager\').shadowRoot.querySelector(\'downloads-item\').shadowRoot.querySelector(\'a\').innerText;');
    // await expect(elementWithText).toContain('.xlsx');
    // await navigateTo(`${browser.baseUrl}/my/sales/create`);
  });

  it('Шаг 5: Пользователь заполняет форму для загрузки прайс-листа', async() => {

    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getSaveBtn());
    await expect(page.getSaveBtn().isEnabled()).toBeFalsy();

    await browser.sleep(1e3);
    await page.getExcelUrlInput().clear();
    await page.getExcelUrlInput().sendKeys(defaultPriceListExternalUrl);

    await browser.sleep(1e3);
    await page.getPriceListNameInput().clear();
    await page.getPriceListNameInput().sendKeys('Распродажа бумаги');

    await page.getPriceListDatePicker().click()
    await browser.sleep(1e3);
    await page.getNextMonth().click();
    await browser.sleep(1e3);
    const items = await page.getDates();
    const index = randomItem(items.length);
    await browserClick(items[index]);

    await browser.sleep(1e3);
    await page.getMinPriceInput().clear();
    await page.getMinPriceInput().sendKeys(50000);

    const tags = await page.getTags();
    await browserClick(tags[0]);
    await browser.sleep(1e3);
    await page.getAllRussiaCheckbox().click();
    await browser.sleep(1e3);
    await page.getDeliverySaveBtn().click();

    await browser.sleep(1e3);
    await page.getPersonNameInput().clear();
    await page.getPersonNameInput().sendKeys(defaultContactName);

    await browser.sleep(1e3);
    await page.getPersonPhoneInput().clear();
    await page.getPersonPhoneInput().sendKeys(defaultContactPhone);

    await browser.sleep(1e3);
    await page.getPersonEmailInput().clear();
    await page.getPersonEmailInput().sendKeys(defaultContactEmail);
  });

  it('Шаг 6: Пользователь перепроверяет какие значения указал', async() => {
    console.log('\t------------------------------->');

    await page.getErrors().isPresent()
      .then((isPresent) => {
        if (isPresent) {
          console.log('\tНеправильно заполнены поля:', `${isPresent ? 'ДА' : 'НЕТ'}`);

          page.getErrors().getText()
            .then((err) => {
              console.log('\tОшибки:', err);
            });
        }
      });

    await page.getFormErrors().isPresent()
      .then((isPresent) => {
        console.log('\tФорма имеет ошибки:', `${isPresent ? 'ДА' : 'НЕТ'}`);
      });

    console.log('\t------------------------------->');
  });

  it('Шаг 7: Пользователь нажимает на кнопку "Сохранить"', async() => {
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getSaveBtn());
    await expect(page.getSaveBtn().isEnabled()).toBeTruthy();
    await browser.executeScript('arguments[0].click();', page.getSaveBtn());
  });

  it('Шаг 8: Пользователь пробрасывает в подраздел "Мои прайс-листы"', async() => {
    await browser.sleep(2e3);
    await browser.wait(until.presenceOf(page.getPriceListTableElement()), defaultTimeout);
  });

  it('Шаг 9: Пользователь видит созданный прайс-лист и закрывает уведомление об этом', async() => {
    await browser.sleep(2e3)
    await page.getNotificationPriceListCreatedClose().click();

    const items = await page.getPriceListRows();
    await expect(items.length).toBe(1);
  });
}

export function authorizedUserViewsUploadedPriceList(page: AppPage) {

  it('Шаг 1: Пользователь открывает для просмотра созданный прайс-лист', async() => {
    await browser.sleep(8e3)
    await page.getPriceListRows().first().click();
  });

  it('Шаг 2: Пользователь видит представление прайс-листа', async() => {
    await browser.sleep(1e3)
    await browser.wait(until.presenceOf(page.getPriceListViewForm()), defaultTimeout);
    await page.getInfoGroupValueElements().getText().then((values) => {
      expect(values).toContain('Распродажа бумаги');
    });
  });

  it('Шаг 3: Пользователь закрывает представление прайс-листа', async() => {
    await browser.sleep(1e3)
    await page.getPriceListViewFormClose().click();
  });
}

export function authorizedUserEditingPriceList(page: AppPage) {

  it('Шаг 1: Пользователь нажимает на кнопку "Редактировать прайс-лист"', async() => {
    await browser.sleep(1e3)
    await browser.wait(until.presenceOf(page.getEditPriceListBtn()), defaultTimeout);
    await page.getEditPriceListBtn().click();
  });

  it('Шаг 2: Пользователь меняет название прайс-листа', async() => {
    await browser.sleep(2e3);
    await page.getPriceListNameInput().clear();
    await page.getPriceListNameInput().sendKeys('Распродажа остатков бумаги для печати');
  });

  it('Шаг 3: Пользователь нажимает на кнопку "Сохранить"', async() => {
    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getSaveBtn());
    await expect(page.getSaveBtn().isEnabled()).toBeTruthy();
    await browser.executeScript('arguments[0].click();', page.getSaveBtn());
  });

  it('Шаг 4: Пользователь закрывает уведомление об успешном изменении прайс-листа', async() => {
    await browser.sleep(2e3)
    await page.getNotificationPriceListCreatedClose().click();
  });
}

export function authorizedUserViewsEditedPriceList(page: AppPage) {

  it('Шаг 1: Пользователь открывает для просмотра отредактированный прайс-лист', async() => {
    await browser.sleep(8e3);
    await page.getPriceListRows().first().click();
  });

  it('Шаг 2: Пользователь видит представление прайс-листа', async() => {
    await browser.sleep(2e3);
    await browser.wait(until.presenceOf(page.getPriceListViewForm()), defaultTimeout);
    await page.getInfoGroupValueElements().getText().then((values) => {
      expect(values).toContain('Распродажа остатков бумаги для печати');
    });
  });

  it('Шаг 3: Пользователь закрывает представление прайс-листа', async() => {
    await browser.sleep(1e3);
    await page.getPriceListViewFormClose().click();
  });
}

export function authorizedUserConfiguresProductCategoryPriceList(page: AppPage) {

  it('Шаг 1: Пользователь переходит в подраздел "Настройка рубрикации"', async() => {
    await page.getCategoriesSettingElement().click();
    await browser.wait(until.presenceOf(page.getCategoriesSettingTableElement()), defaultTimeout);
  });

  it('Шаг 2: Пользователь нажимает на кнопку "Изменить категорию 1СН"', async() => {
    await browser.sleep(2e3);
    await page.getEdit1cCategoryBtn().click();
  });

  it('Шаг 3: Пользователь видит форму с возможностью выбора категории 1СН', async() => {
    await browser.wait(until.presenceOf(page.getCategorySearchForm()), defaultTimeout);
  });

  it('Шаг 4: Пользователь вводит "Бумага белая классов" в форму поиска категории 1СН', async() => {
    await page.getCategoryNameInput().clear();
    await page.getCategoryNameInput().sendKeys('Бумага белая классов');
  });

  it('Шаг 5: Пользователь выбирает категорию 1СН подходящую', async() => {
    await browser.sleep(2e3);
    await page.getCategoryTree().last().click();
  });

  it('Шаг 6: Пользователь нажимает на кнопку "Сохранить"', async() => {
    await browser.sleep(1e3);
    await page.getSaveBtn().click();
  });
}

export function authorizedUserGoesToSupplierStore(page: AppPage) {

  it('Шаг 1: Пользователь возвращается в подраздел "Мои прайс-листы"', async() => {
    await page.getMyPriceListElement().click();
  });

  it('Шаг 2: Пользователь нажимает на кнопку "Перейти в магазин поставщика"', async() => {
    await browser.sleep(2e3);
    await browser.wait(until.presenceOf(page.getGoesToSupplierStoreBtn()), defaultTimeout);
    await page.getGoesToSupplierStoreBtn().click();
  });

  it('Шаг 3: Пользователь видит опубликованные торговые предложения', async() => {
    await browser.sleep(2e3);
    await browser.wait(until.presenceOf(page.getSupplierStore()), defaultTimeout);
    await browser.wait(presenceOfAll(page.getTradeOffers()), defaultTimeout);
  });
}

export function authorizedUserDeletesPriceList(page: AppPage) {

  it('Шаг 1: Пользователь возвращается в раздел сайта "Мои продажи"', async() => {
    await browser.wait(until.presenceOf(page.getMySalesElement()), defaultTimeout);
    await page.getMySalesElement().click();
  });

  it('Шаг 2: Пользователь удаляет созданный прайс-лист', async() => {
    await browser.sleep(1e3);
    await browser.wait(until.presenceOf(page.getDeletePriceListBtn()), defaultTimeout);
    await page.getDeletePriceListBtn().click();
    await browser.wait(until.presenceOf(page.getDeletePriceListOkBtn()), defaultTimeout);
    await page.getDeletePriceListOkBtn().click();
  });

  it('Шаг 3: Пользователь видит, что все прайс-листы удалены', async() => {
    await browser.sleep(2e3);
    const items = await page.getPriceListRows();
    await expect(items.length).toBe(0);
  });
}
