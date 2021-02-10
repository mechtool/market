import { browser, protractor, ProtractorExpectedConditions } from 'protractor';

export const { defaultTimeout, defaultSupplierNamePart } = browser.params;

export function randomItem(index: number): number {
  return Math.floor(Math.random() * Math.floor(index));
}

export function randomCategory(): number {
  const categories = [985, 1154, 3275];
  return categories[randomItem(categories.length)];
}

export function randomQuery(): string {
  const queries = ['вода', 'хлеб', 'молоко'];
  return queries[randomItem(queries.length)];
}

export let defaultOrganizationINN = '3128040080';
export let defaultContactName = 'Федор Тестович';
export let defaultContactPhone = '9512223344';
export let defaultContactEmail = 'testovich.fedor@ftestovich.ru';
export let defaultDeliveryCity = 'Москва г';
export let defaultDeliveryStreet = 'Лермонтовская ул';

export const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

export async function navigateTo(url: string = browser.baseUrl): Promise<any> {
  return browser.get(url) as Promise<any>;
}

export async function refresh(): Promise<any> {
  return browser.refresh()  as Promise<any>;
}

export async function restart(): Promise<any> {
  return browser.restart()  as Promise<any>;
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

export function stalenessOfAll(elementArrayFinder) {
  return function () {
    return elementArrayFinder.count((count) => count <= 0);
  };
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
