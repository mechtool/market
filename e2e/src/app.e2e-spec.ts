/*
import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
import { LoginItsPage } from './login-its/login-its.po';
import { logout, waitForUrlToChangeTo, navigateTo } from './utils/utils';

browser.driver.manage().window().maximize();

describe('При запуске приложения', async () => {
  const page = new AppPage();

  beforeAll(async () => {
    await browser.waitForAngularEnabled(true);
    await navigateTo();
  });

  it('отображается навигационный бар', async () => {
    await expect(page.getNavbarElement().isPresent()).toBe(true);
  });

  describe('Когда выполняется клик на лого', async () => {
    beforeAll(async () => {
      await page.getNavbarLogoElement().click();
      await browser.sleep(3e2);
    });

    it(`уменьшается навигационный бар`, async () => {
      await expect(page.getNavbarContainerElement().getAttribute('class')).toContain('minified');
    });

    it(`увеличивается рабочее пространство`, async () => {
      await expect(page.getMainElement().getAttribute('class')).toContain('wide');
    });

    // describe('Когда выполняется клик на лого', async () => {
    //   beforeAll(async () => {
    //     await page.getNavBarLKElement().click();
    //     await browser.sleep(3e2);
    //   });
    //
    //   it(`отображается кнопка 'Войти' в меню`, async () => {
    //     await expect(page.getNavBarLoginElement().isPresent()).toBe(true);
    //   });
    // });
  });

  // afterAll(async () => {
  //   await logout();
  // });
});

// describe('При запуске приложения закрытого аутентификацией роута', async () => {
//   const page = new AppPage();
//   const loginItsPage = new LoginItsPage();
//
//   beforeAll(async () => {
//     await browser.waitForAngularEnabled(false);
//     await navigateTo('https://10.70.2.97:4200/my/orders');
//   });
//
//   it(`должно быть перенаправление на http://login(-dev)*.1c.ru`, async () => {
//     await expect(browser.getCurrentUrl()).toMatch(new RegExp('https://login(-dev)*.1c.ru/login', 'i'));
//   });
//
//   it(`после аутентификации должно быть перенаправление на закрытый аутентификацией роут`, async () => {
//     await loginItsPage.authUser();
//     await expect(waitForUrlToChangeTo('/my/orders')).toBeTruthy();
//   });
//
//   describe('Когда выполняется клик на лого', async () => {
//     beforeAll(async () => {
//       await page.getNavBarLKElement().click();
//       await browser.sleep(3e2);
//     });
//
//     it(`отображается кнопка 'Мои заказы' в меню`, async () => {
//       await expect(page.getNavBarMyOrdersElement().isPresent()).toBe(true);
//     });
//   });
//
//   afterAll(async () => {
//     await logout();
//   });
// });
*/
