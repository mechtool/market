import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
import { logout, waitForUrlToChangeTo, navigateTo } from './utils/utils';

describe('При запуске приложения', async () => {
  const page = new AppPage();

  beforeAll(async () => {
    await browser.waitForAngularEnabled(false);
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

    it(`расширяется навигационный бар`, async () => {
      await expect(page.getNavbarContainerElement().getAttribute('class')).toContain('showed');
    });

    it(`уменьшается рабочее пространство`, async () => {
      await expect(page.getMainElement().getAttribute('class')).toContain('moved');
    });

    // afterAll(async () => {
    //   await logout();
    // });

  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });

  // afterAll(async () => {
  //   await logout();
  // });

});
