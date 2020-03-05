import { browser, by, element } from 'protractor';

export async function logout() {
  await browser.get(`https://login-dev.1c.ru/logout?service=${browser.baseUrl}`);
  await browser.get(`https://login-dev.1c.ru/login?service=${browser.baseUrl}`);
}

export async function navigateTo(url: string = browser.baseUrl) {
  return browser.get(url) as Promise<any>;
}

export async function waitForUrlToChangeTo(urlToChange: any, includeTicketQueryParam = false): Promise<boolean>  {
  return browser.wait(() => {
    return browser.getCurrentUrl()
      .then((url: string) => {
        if (!includeTicketQueryParam) {
          return url.includes(urlToChange) && !url.includes('ticket=ST');
        }
        if (includeTicketQueryParam) {
          return url.includes(urlToChange);
        }
      });
  });
}

function makeINN() {
  let result = '';
  const characters = '123456789';
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function encodeBase64(str: any) {
  return Buffer.from(unescape(encodeURIComponent(str)), 'ascii').toString('base64');
}

export function generateRegCtx() {
  return encodeBase64(JSON.stringify({
    cid: 'E2E-TEST_cid',
    app: 'E2E-TEST_app',
    name: 'E2E-TEST_name',
    legalId: makeINN(),
    contacts: {
      phone: 'E2E-TEST_phone',
      email: 'E2E-TEST@el-mail.ru',
      address: 'E2E-TEST_address',
    }
  }));
}

export function presenceOfAll(elementArrayFinder) {
  return function () {
    return elementArrayFinder.count(count => count > 0);
  };
}
// browser.wait(presenceOfAll(orgsPage.getOrganizationsElements()), 10000);
