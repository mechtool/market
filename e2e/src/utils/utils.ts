import { browser, protractor, ProtractorExpectedConditions } from 'protractor';

export async function logout() {
  await browser.get(`https://login-dev.1c.ru/logout?service=${browser.baseUrl}`);
  await browser.get(`https://login-dev.1c.ru/login?service=${browser.baseUrl}`);
}

export function expectedConditions(): ProtractorExpectedConditions {
  return protractor.ExpectedConditions;
}

export async function navigateTo(url: string = browser.baseUrl) {
  return browser.get(url) as Promise<any>;
}

export async function waitForUrlToChangeTo(urlToChange: any, includeTicketQueryParam = false): Promise<boolean> {
  return browser.wait(() => {
    return browser.getCurrentUrl().then((url: string) => {
      if (!includeTicketQueryParam) {
        return url.includes(urlToChange) && !url.includes('ticket=ST');
      }
      if (includeTicketQueryParam) {
        return url.includes(urlToChange);
      }
    });
  });
}

export function presenceOfAll(elementArrayFinder) {
  return function () {
    return elementArrayFinder.count((count) => count > 0);
  };
}
