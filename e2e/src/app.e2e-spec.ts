import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
import { logout, waitForUrlToChangeTo, navigateTo } from './utils/utils';

describe('workspace-project App', () => {
  const page = new AppPage();

  beforeAll(async () => {
    await browser.waitForAngularEnabled(false);
    await navigateTo();
  });

  it('should display welcome message', async () => {
    await expect(page.getTitleText()).toEqual('client app is running!');
  });

  // afterEach(async () => {
  //   // Assert that there are no errors emitted from the browser
  //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  //   expect(logs).not.toContain(jasmine.objectContaining({
  //     level: logging.Level.SEVERE,
  //   } as logging.Entry));
  // });

  afterAll(async () => {
    await logout();
  });

});
