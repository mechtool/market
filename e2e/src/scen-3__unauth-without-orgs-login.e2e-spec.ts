import { browser, by, element, protractor } from 'protractor';
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
    userWithoutOrganizationsDeAuths(page);
  });

  describe('Пользователь с организациями авторизуется в приложении', async() => {
    userWithOrganizationsAuths(page, loginPage);
  });

  describe('Пользователь регистрирует организацию', async() => {
    userRegistersOrganizations(page, registerOrganizationIPPage, promoPage);
  });

});

export function userAgrees(page: AppPage) {
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
}

export function userGoesToPromoRoute(page: AppPage, promoPage: PromoPage) {
  it('Шаг 1: Пользователь видит раздел меню "Акции"', async() => {
    await browser.wait(until.presenceOf(page.getPromoElement()), defaultTimeout);
  });

  it('Шаг 2: Пользователь нажимает на раздел меню "Акции"', async() => {
    await page.getPromoElement().click();
  });

  it('Шаг 3: Видит страницу со списком текущих акций', async() => {
    await browser.wait(until.presenceOf(promoPage.getTitleElement()), defaultTimeout);
  });
}

export function userWithoutOrganizationsAuths(page: AppPage, loginPage: LoginItsPage) {

  it('Шаг 1: Пользователь видит раздел меню войти "Войти"', async() => {
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
    await loginPage.getLoginInput().sendKeys(userLoginWithoutAvailableOrganizations);
    await loginPage.getPasswordInput().sendKeys(userPassword);
    await loginPage.getLoginButton().click();
  });

  it('Шаг 5: Пользователь видит меню для аутентифицированного пользователя', async() => {
    await browser.switchTo().window(windowHandles[0]);
    windowHandles = null;
    await browser.wait(until.presenceOf(page.getAuthenticatedMenuElement()), defaultTimeout);
  });

  it('Шаг 6: Пользователь видит страницу регистрации новой организации', async() => {
    await browser.wait(until.presenceOf(page.getRegisterOrganizationElement()), defaultTimeout);
    urlToRedirect = await browser.getCurrentUrl();
  });

}

export function userWithoutOrganizationsDeAuths(page: AppPage) {

  it('Шаг 1: Пользователь видит раздел меню "Выход"', async() => {
    await browser.wait(until.presenceOf(page.getAuthenticatedMenuElement()), defaultTimeout);
    await page.getAuthenticatedMenuElement().click();
  });

  it('Шаг 2: Пользователь нажимает на раздел меню "Выход"', async() => {
    await browser.wait(until.presenceOf(page.getLogoutElement()), defaultTimeout);
    await page.getLogoutElement().click();
  });

}

export function userWithOrganizationsAuths(page: AppPage, loginPage: LoginItsPage) {

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
    await loginPage.getLoginInput().sendKeys(userLoginWithAvailableOrganizations);
    await loginPage.getPasswordInput().sendKeys(userPassword);
    await loginPage.getLoginButton().click();
  });

  it('Шаг 5: Пользователь видит меню для аутентифицированного пользователя', async() => {
    await browser.switchTo().window(windowHandles[0]);
    windowHandles = null;
    await browser.wait(until.presenceOf(page.getAnonymousMenuElement()), defaultTimeout);
    // TODO: remove ESCAPE
    await browser.sleep(1e3);
    browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    await browser.sleep(1e3);
  });

}

export function userRegistersOrganizations(page: AppPage, registerOrganizationIPPage: RegisterOrganizationIPPage, promoPage: PromoPage) {

  it('Шаг 1: Пользователь переходит по сохраненной ссылке', async() => {
    await navigateTo(urlToRedirect);
  });

  it('Шаг 2: Пользователь видит страницу регистрации новой организации', async() => {
    await browser.wait(until.presenceOf(page.getRegisterOrganizationElement()), defaultTimeout);
    // await browser.wait(until.presenceOf(page.getModalRegisterOrganizationElement()), defaultTimeout);
  });

  it('Шаг 3: Пользователь видит поля формы для регистрации новой организации', async() => {
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationNameElement()), defaultTimeout);
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationContactFioElement()), defaultTimeout);
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationContactEmailElement()), defaultTimeout);
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationContactPhoneElement()), defaultTimeout);
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationAgreeElement()), defaultTimeout);
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getBtnElement()), defaultTimeout);
  });

  it('Шаг 4: Пользователь вводит ИНН регистрируемой организации', async() => {
    const inn = generateINNforIP();
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationInnElement()), defaultTimeout);
    await registerOrganizationIPPage.getOrganizationInnElement().sendKeys(inn);
  });

  it('Шаг 5: Пользователь заполняет поля в форме (Название организации, ФИО, email, телефон)', async() => {
    await registerOrganizationIPPage.getOrganizationNameElement().sendKeys(organizationName);
    await registerOrganizationIPPage.getOrganizationContactFioElement().sendKeys(defaultContactName);
    await registerOrganizationIPPage.getOrganizationContactEmailElement().sendKeys(defaultContactEmail);
    await registerOrganizationIPPage.getOrganizationContactPhoneElement().sendKeys(defaultContactPhone);
  });

  it('Шаг 7: Пользователь соглашается с тем, что являюсь уполномоченным представителем регистрируемой организации', async() => {
    await browser.wait(until.presenceOf(registerOrganizationIPPage.getOrganizationAgreeElement()), defaultTimeout);
    await browser.executeScript('arguments[0].scrollIntoView(true);', registerOrganizationIPPage.getOrganizationAgreeElement());
    await browser.executeScript('arguments[0].click();', registerOrganizationIPPage.getOrganizationAgreeElement());
    await browser.sleep(3e3);
  });

  it('Шаг 8: Кнопка регистрации активна?', async() => {

    await registerOrganizationIPPage.getBtnElement().isEnabled()
      .then((isEnabled) => {
        console.log('\tКнопка регистрации активна:', `${isEnabled ? 'ДА' : 'НЕТ'}`);
      });

    await registerOrganizationIPPage.getBtnElement().getText()
      .then((text) => {
        console.log('\tНа кнопке написано:', text);
      });

    await expect(registerOrganizationIPPage.getBtnElement().isEnabled()).toEqual(true);
  });

  it('Шаг 9: Пользователь перепроверяет какие значения указал', async() => {

    console.log('\t------------------------------->');

    await browser.executeScript('return arguments[0].value', registerOrganizationIPPage.getOrganizationInnElement())
      .then((res) => {
        console.log('\tИНН:', res);
      });

    await browser.executeScript('return arguments[0].value', registerOrganizationIPPage.getOrganizationNameElement())
      .then((res) => {
        console.log('\tНаименование:', res);
      });

    await browser.executeScript('return arguments[0].value', registerOrganizationIPPage.getOrganizationContactFioElement())
      .then((res) => {
        console.log('\tКак к Вам обращаться:', res);
      });

    await browser.executeScript('return arguments[0].value', registerOrganizationIPPage.getOrganizationContactEmailElement())
      .then((res) => {
        console.log('\tE-mail:', res);
      });

    await browser.executeScript('return arguments[0].value', registerOrganizationIPPage.getOrganizationContactPhoneElement())
      .then((res) => {
        console.log('\tТелефон:', res);
      });

    await element(by.css('.form-with-errors')).isPresent()
      .then((isPresent) => {
        console.log('\tФорма имеет ошибки:', `${isPresent ? 'ДА' : 'НЕТ'}`);
      });

    console.log('\t------------------------------->');
  });

  it('Шаг 10: Пользователь нажимает на кнопку регистрации организации', async() => {
    await browser.getCurrentUrl().then((url) => {
      console.log('\tURL страницы регистрации организации:', decodeURIComponent(url));
    })
    await browser.executeScript('arguments[0].scrollIntoView(true);', registerOrganizationIPPage.getBtnElement());
    await browser.executeScript('arguments[0].click();', registerOrganizationIPPage.getBtnElement());
  });

  it('Шаг 11: Видит страницу со списком текущих акций', async() => {
    await browser.sleep(2e3);
    await browser.getCurrentUrl().then((url) => {
      console.log('\tURL страницы акций:', decodeURIComponent(url));
    })
    await browser.wait(until.presenceOf(promoPage.getTitleElement()), defaultTimeout);
  });

}

