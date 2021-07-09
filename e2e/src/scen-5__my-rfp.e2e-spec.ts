import { AppPage } from './scen-5__my-rfp.po';
import { LoginItsPage, userLoginForMySales, userPassword } from './login-its/login-its.po';
import {
  browserClick,
  defaultContactEmail,
  defaultContactName,
  defaultContactPhone,
  defaultTimeout,
  navigateTo,
  randomItem,
  restart,
  until
} from './utils/utils';
import { browser } from 'protractor';

let windowHandles = null;


describe('Сценарий: Работа с разделом сайта "Мои запросы". Создание, изменение и отмена заказа коммерческого предложения.', async() => {
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

  describe('Пользователь изучает раздел сайта "Мои запросы"', async() => {
    authorizedUserExaminesMyRequests(page);
  });

  describe('Пользователь создает новый заказ коммерческого предложения', async() => {
    authorizedUserCreatingNewRFP(page);
  });

  describe('Пользователь просматривает созданный заказ коммерческого предложения', async() => {
    authorizedUserViewsCreatedRFP(page);
  });

  describe('Пользователь редактирует заказ коммерческого предложения', async() => {
    authorizedUserEditingRFP(page);
  });

  describe('Пользователь просматривает отредактированный заказ коммерческого предложения', async() => {
    authorizedUserViewsEditedRFP(page);
  });

  describe('Пользователь отменяет заказ коммерческого предложения', async() => {
    authorizedUserCancelsRFP(page);
  });
});

export function userAuthenticated(page: AppPage, loginPage: LoginItsPage) {

  it('Шаг 1: Пользователь видит раздел меню "Войти"', async() => {
    await browser.wait(until.presenceOf(page.getAnonymousMenuElement()), defaultTimeout);
    await page.getAnonymousMenuElement().click();
  });

  it('Шаг 2: Пользователь нажимает на раздел меню "Войти"', async() => {
    await browser.wait(until.presenceOf(page.getLoginElement()), defaultTimeout);
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

  it('Шаг 5: Пользователь видит меню для аутентифицированного пользователя', async() => {
    await browser.switchTo().window(windowHandles[0]);
    windowHandles = null;
    await browser.wait(until.presenceOf(page.getAuthenticatedMenuElement()), defaultTimeout);
  });
}

export function authorizedUserExaminesMyRequests(page: AppPage) {

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

  it('Шаг 5: Пользователь переходит в раздел сайта "Мои запросы"', async() => {
    await browser.wait(until.presenceOf(page.getAuthenticatedMenuElement()), defaultTimeout);
    await page.getAuthenticatedMenuElement().click();
    await browser.wait(until.presenceOf(page.getMyRequestsElement()), defaultTimeout);
    await page.getMyRequestsElement().click();
  });

  it('Шаг 6: Пользователь видит подраздел "Запросы коммерческих предложений"', async() => {
    await browser.wait(until.presenceOf(page.getRFPTableElement()), defaultTimeout);
  });

  it('Шаг 7: Пользователь переходит в подраздел "Коммерческие предложения"', async() => {
    await page.getCommercialOffersTabElement().click();
    await browser.wait(until.presenceOf(page.getOfferTableElement()), defaultTimeout);
  });
}

export function authorizedUserCreatingNewRFP(page: AppPage) {

  it('Шаг 1: Пользователь возвращается в подраздел "Запросы коммерческих предложений"', async() => {
    await page.getRequestForProposalTabElement().click();
  });

  it('Шаг 2: Пользователь нажимает на кнопку "Создать"', async() => {
    await browser.wait(until.presenceOf(page.getCreateRFPBtnElement()), defaultTimeout);
    await page.getCreateRFPBtnElement().click();
  });

  it('Шаг 3: Пользователь видит форму для создания запроса коммерческого предложения', async() => {
    await browser.wait(until.presenceOf(page.getRFPCreatingFormElement()), defaultTimeout);
  });

  it('Шаг 4: Пользователь заполняет форму запроса коммерческого предложения', async() => {
    await browser.sleep(1e3);
    await page.getPersonNameInput().clear();
    await page.getPersonNameInput().sendKeys(defaultContactName);

    await browser.sleep(1e3);
    await page.getPersonPhoneInput().clear();
    await page.getPersonPhoneInput().sendKeys(defaultContactPhone);

    await browser.sleep(1e3);
    await page.getPersonEmailInput().clear();
    await page.getPersonEmailInput().sendKeys(defaultContactEmail);

    await browser.sleep(1e3);
    await page.getDatePickerCollectingFrom().click()
    await browser.sleep(1e3);
    await page.getNextMonth().click();
    await browser.sleep(1e3);
    let items = await page.getDates();
    await browserClick(items[randomItem(items.length)]);

    await browser.sleep(1e3);
    await page.getDatePickerCollectingTo().click()
    await browser.sleep(1e3);
    await page.getNextMonth().click();
    await page.getNextMonth().click();
    await page.getNextMonth().click();
    await browser.sleep(1e3);
    items = await page.getDates();
    await browserClick(items[randomItem(items.length)]);

    await browser.sleep(1e3);
    await page.getDatePickerConsideringTo().click()
    await browser.sleep(1e3);
    await page.getNextMonth().click();
    await page.getNextMonth().click();
    await page.getNextMonth().click();
    await page.getNextMonth().click();
    await page.getNextMonth().click();
    await browser.sleep(1e3);
    items = await page.getDates();
    await browserClick(items[randomItem(items.length)]);
  });

  it('Шаг 5: Пользователь заполняет форму для первой позиции товара', async() => {
    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getPosition1ProductNameInput());
    await page.getPosition1ProductNameInput().clear();
    await page.getPosition1ProductNameInput().sendKeys('CITIZEN Калькулятор настольный 12-разрядный SDC-444S черный');

    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getPosition1ProductDescriptionInput());
    await page.getPosition1ProductDescriptionInput().clear();
    await page.getPosition1ProductDescriptionInput().sendKeys('Калькулятор снабжен функцией расчета с учетом торговой наценки, клавишами смены знака, исправления числа, клавишей двойного нуля. Имеет две ячейки памяти для хранения двух значений одновременно, настройку представления десятичных чисел и округления значений (кол-ва знаков после нуля). Режим автоотключения Функции: 2-е питание, двойная память, MU Питание: Солнечный элемент + батарея Цвет: черный Состав короба: 10шт.');

    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getPosition1ProductPartNumberInput());
    await page.getPosition1ProductPartNumberInput().clear();
    await page.getPosition1ProductPartNumberInput().sendKeys('577957');

    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getPosition1ProductQuantityInput());
    await page.getPosition1ProductQuantityInput().clear();
    await page.getPosition1ProductQuantityInput().sendKeys(10);

    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getPosition1ProductMaxPriceInput());
    await page.getPosition1ProductMaxPriceInput().clear();
    await page.getPosition1ProductMaxPriceInput().sendKeys(799);
  });

  it('Шаг 6: Пользователь заполняет форму для второй позиции товара', async() => {
    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getNewPosition());
    await browser.executeScript('arguments[0].click();', page.getNewPosition());

    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getPosition2ProductNameInput());
    await page.getPosition2ProductNameInput().clear();
    await page.getPosition2ProductNameInput().sendKeys('Калькулятор SIGMA DC5408 настольный, 8 разрядов');

    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getPosition2ProductDescriptionInput());
    await page.getPosition2ProductDescriptionInput().clear();
    await page.getPosition2ProductDescriptionInput().sendKeys('Настольный калькулятор Sigma DC5408 с 8 разрядами Состав короба: 40шт.');

    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getPosition2ProductPartNumberInput());
    await page.getPosition2ProductPartNumberInput().clear();
    await page.getPosition2ProductPartNumberInput().sendKeys('535248');

    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getPosition2ProductQuantityInput());
    await page.getPosition2ProductQuantityInput().clear();
    await page.getPosition2ProductQuantityInput().sendKeys(5);

    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getPosition2ProductMaxPriceInput());
    await page.getPosition2ProductMaxPriceInput().clear();
    await page.getPosition2ProductMaxPriceInput().sendKeys(399);
  });

  it('Шаг 7: Пользователь перепроверяет какие значения указал', async() => {
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

  it('Шаг 8: Пользователь нажимает на кнопку "Сохранить"', async() => {
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getSaveBtn());
    await browser.executeScript('arguments[0].click();', page.getSaveBtn());
  });

  it('Шаг 9: Пользователь пробрасывает в подраздел "Запросы коммерческих предложений"', async() => {
    await browser.sleep(2e3);
    await browser.wait(until.presenceOf(page.getRFPTableElement()), defaultTimeout);
  });

  it('Шаг 10: Пользователь видит созданный запроса коммерческого предложения', async() => {
    const items = await page.getRFPRows();
    await expect(items.length > 0).toBeTruthy();
  });
}

export function authorizedUserViewsCreatedRFP(page: AppPage) {

  it('Шаг 1: Пользователь открывает для просмотра созданный запрос коммерческого предложения', async() => {
    await browser.sleep(2e3)
    await page.getRFPRows().get(1).click();
  });

  it('Шаг 2: Пользователь видит представление запроса коммерческого предложения', async() => {
    await browser.sleep(1e3)
    await browser.wait(until.presenceOf(page.getRFPViewForm()), defaultTimeout);
    await page.getInfoGroupValueElements().getText().then((values) => {
      expect(values).toContain('Калькулятор SIGMA DC5408 настольный, 8 разрядов');
    });
  });

  it('Шаг 3: Пользователь закрывает представление запроса коммерческого предложения', async() => {
    await browser.sleep(1e3)
    await page.getRFPViewFormClose().click();
  });
}

export function authorizedUserEditingRFP(page: AppPage) {

  it('Шаг 1: Пользователь нажимает на кнопку "Редактировать запрос коммерческого предложения"', async() => {
    await browser.sleep(1e3)
    await browser.wait(until.presenceOf(page.getEditRFPBtn()), defaultTimeout);
    await page.getEditRFPBtn().click();
  });

  it('Шаг 2: Пользователь удаляет вторую позицию из запроса коммерческого предложения', async() => {
    await browser.sleep(2e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getPositionRemover().last());
    await browser.executeScript('arguments[0].click();', page.getPositionRemover().last());
  });

  it('Шаг 3: Пользователь нажимает на кнопку "Сохранить"', async() => {
    await browser.sleep(1e3);
    await browser.executeScript('arguments[0].scrollIntoView(true);', page.getSaveBtn());
    await browser.executeScript('arguments[0].click();', page.getSaveBtn());
  });
}

export function authorizedUserViewsEditedRFP(page: AppPage) {

  it('Шаг 1: Пользователь открывает для просмотра отредактированный запрос коммерческого предложения', async() => {
    await browser.sleep(2e3);
    await page.getRFPRows().get(1).click();
  });

  it('Шаг 2: Пользователь видит представление запроса коммерческого предложения', async() => {
    await browser.sleep(1e3)
    await browser.wait(until.presenceOf(page.getRFPViewForm()), defaultTimeout);
    await page.getInfoGroupValueElements().getText().then((values) => {
      expect(values).not.toContain('Калькулятор SIGMA DC5408 настольный, 8 разрядов');
    });
  });

  it('Шаг 3: Пользователь закрывает представление запроса коммерческого предложения', async() => {
    await browser.sleep(1e3);
    await page.getRFPViewFormClose().click();
 });
}

export function authorizedUserCancelsRFP(page: AppPage) {

  it('Шаг 1: Пользователь отменяет созданный запрос коммерческого предложения', async() => {
    await browser.sleep(1e3);
    await browser.wait(until.presenceOf(page.getCancelRFPBtn()), defaultTimeout);
    await page.getCancelRFPBtn().click();
    await browser.wait(until.presenceOf(page.getCancelRFPOkBtn()), defaultTimeout);
    await page.getCancelRFPOkBtn().click();
  });

  it('Шаг 2: Пользователь видит, что все запросы коммерческих предложений отменены', async() => {
    await browser.sleep(3e3);
    const items = await page.getActualRFPRows();
    await expect(items.length).toBe(0)
  });
}
