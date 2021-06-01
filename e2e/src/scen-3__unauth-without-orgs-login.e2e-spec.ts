import { browser, protractor } from 'protractor';
import { AppPage } from './scen-3__unauth-without-orgs-login.po';
import {
  LoginItsPage,
  userLoginWithAvailableOrganizations,
  userLoginWithoutAvailableOrganizations,
  userPassword
} from './login-its/login-its.po';
import { PromoPage } from './promo/promo.po';
import { RegisterOrganizationIPPage } from './register-organization-ip/register-organization-ip.po';
import {
  browserClick,
  defaultContactEmail,
  defaultContactName,
  defaultContactPhone,
  defaultOrganizationIPNamePattern,
  defaultTimeout,
  generateINNforIP,
  navigateTo,
  restart,
  until,
} from './utils/utils';

let urlToRedirect = null;
let windowHandles = null;
let isRegisterOrganizationButtonEnabled = null;
const organizationName = `${defaultOrganizationIPNamePattern}${Math.random()}`;

describe('Сценарий: Авторизация пользователя без организаций', async() => {
  const page = new AppPage();
  const loginPage = new LoginItsPage();
  const promoPage = new PromoPage();
  const registerOrganizationIPPage = new RegisterOrganizationIPPage();

  beforeAll(async() => {
    await restart();
    await navigateTo();
    await browser.waitForAngularEnabled(false);
  });

  describe('Пользователь принимает пользовательское соглашение', async() => {
    userAgrees(page);
  });

  describe('Пользователь переходит на страницу "Акции"', async() => {
    userGoesToPromoRoute(page, promoPage);
  });

  describe('Пользователь без организаций авторизуется в приложении', async() => {
    userWithoutOrganizationsAuths(page, loginPage);
  });

  describe('Пользователь без организаций деавторизуется в приложении', async() => {
    userWithoutOrganizationsDeAuths(page, loginPage);
  });

  describe('Пользователь с организациями авторизуется в приложении', async() => {
    userWithOrganizationsAuths(page, loginPage);
  });

  describe('Пользователь регистрирует организацию', async() => {
    userRegistersOrganizations(page, registerOrganizationIPPage, promoPage);
  });

});

export function userAgrees(page: any) {
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
}

export function userGoesToPromoRoute(page: any, promoPage: any) {
  it('Шаг 1: Пользователь видит кнопку "Акции"', async() => {
    await browser.wait(until.presenceOf(page.getPromoElement()), defaultTimeout);
  });

  it('Шаг 2: Пользователь нажимает на кнопку "Акции"', async() => {
    await page.getPromoElement().click();
  });

  it('Шаг 3: Видит страницу со списком текущих акций', async() => {
    await browser.wait(until.presenceOf(promoPage.getTitleElement()), defaultTimeout);
  });
}

export function userWithoutOrganizationsAuths(page: any, loginPage: any) {

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
    await loginPage.getLoginInput().sendKeys(userLoginWithoutAvailableOrganizations);
    await loginPage.getPasswordInput().sendKeys(userPassword);
    await loginPage.getLoginButton().click();
  });

  it('Шаг 5: Пользователь видит кнопку "Мои заказы"', async() => {
    await browser.switchTo().window(windowHandles[0]);
    windowHandles = null;
    await browser.wait(until.presenceOf(page.getMyOrdersElement()), defaultTimeout);
  });

  it('Шаг 6: Пользователь видит модальное окно "Регистрация новой организации"', async() => {
    await browser.wait(until.presenceOf(page.getModalRegisterOrganizationElement()), defaultTimeout);
    urlToRedirect = await browser.getCurrentUrl();
  });

}

export function userWithoutOrganizationsDeAuths(page: any, loginPage: any) {

  it('Шаг 1: Пользователь нажимает на кнопку ESC', async() => {
    browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
  });

  it('Шаг 2: Пользователь видит кнопку "Выход"', async() => {
    await browser.wait(until.presenceOf(page.getLogoutElement()), defaultTimeout);
  });

  it('Шаг 3: Пользователь нажимает на кнопку "Выход"', async() => {
    await page.getLogoutElement().click();
  });

}

export function userWithOrganizationsAuths(page: any, loginPage: any) {

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
    // TODO: remove ESCAPE
    await browser.sleep(1e3);
    browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.sleep(1e3);
  });

}

export function userRegistersOrganizations(page: any, registerOrganizationIPPage: any, promoPage: any) {

  it('Шаг 1: Пользователь переходит по сохраненной ссылке', async() => {
    await navigateTo(urlToRedirect);
  });

  it('Шаг 2: Пользователь видит модальное окно "Регистрация новой организации"', async() => {
    await browser.wait(until.presenceOf(page.getModalRegisterOrganizationElement()), defaultTimeout);
  });

  it('Шаг 3: Пользователь вводит ИНН регистрируемой организации', async() => {
    const inn = generateINNforIP();
    await browser.wait(until.presenceOf(page.getModalRegisterOrganizationINN()), defaultTimeout);
    await page.getModalRegisterOrganizationINN().sendKeys(inn);
  });

  it('Шаг 4: Пользователь нажимает на кнопку "Продолжить"', async() => {
    await browser.wait(until.presenceOf(page.getModalRegisterOrganizationBtn()), defaultTimeout);
    await browserClick(await page.getModalRegisterOrganizationBtn());
  });

  it('Шаг 5: Пользователь видит форму для регистрации новой организации', async() => {
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationNameElement()), defaultTimeout);
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationContactFioElement()), defaultTimeout);
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationContactEmailElement()), defaultTimeout);
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationContactPhoneElement()), defaultTimeout);
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationAgreeElement()), defaultTimeout);
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getBtnElement()), defaultTimeout);
  });

  it('Шаг 6: Пользователь заполняет поля в форме и принимает условия соглашения', async() => {
    await registerOrganizationIPPage.getOrganizationNameElement().sendKeys(organizationName);
    await registerOrganizationIPPage.getOrganizationContactFioElement().sendKeys(defaultContactName);
    await registerOrganizationIPPage.getOrganizationContactEmailElement().sendKeys(defaultContactEmail);
    await registerOrganizationIPPage.getOrganizationContactPhoneElement().sendKeys(defaultContactPhone);
    await browserClick(await registerOrganizationIPPage.getOrganizationAgreeElement());
  });

  it('Шаг 7: Кнопка регистрации активна?', async() => {
    isRegisterOrganizationButtonEnabled = await registerOrganizationIPPage.getBtnElement().isEnabled();
  });

  it('Шаг 8: Пользователь нажимает на кнопку регистрации организации', async() => {
    if (isRegisterOrganizationButtonEnabled) {
      await browserClick(await registerOrganizationIPPage.getBtnElement());
    }
  });

  it('Шаг 9: Видит страницу со списком текущих акций', async() => {
    await browser.wait(until.presenceOf(promoPage.getTitleElement()), defaultTimeout);
  });

}

