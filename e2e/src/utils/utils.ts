import { browser, ElementFinder, protractor, ProtractorExpectedConditions } from 'protractor';

export const {
  defaultTimeout, defaultSupplierNamePart, defaultOrganizationINN, defaultOrganizationKPP,
  defaultOrganizationName, defaultContactName, defaultContactPhone, defaultContactEmail,
  defaultDeliveryCity, defaultDeliveryStreet,
} = browser.params;

export function randomItem(index: number): number {
  return Math.floor(Math.random() * Math.floor(index));
}

export function randomCategory(): number {
  const categories = [985, 1154, 3275];
  return categories[randomItem(categories.length)];
}

export function randomQuery(except?: string): string {
  let queries = ['вода', 'хлеб', 'молоко'];
  if (except) {
    queries = queries.filter(x => x !==except)
  }
  return queries[randomItem(queries.length)];
}

export const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

export async function navigateTo(url: string = browser.baseUrl): Promise<any> {
  return browser.get(url) as Promise<any>;
}

export async function restart(): Promise<any> {
  return browser.restart()  as Promise<any>;
}

export function presenceOfAll(elementArrayFinder): any {
  return function () {
    return elementArrayFinder.count((count) => count > 0);
  };
}

export function elementTextContentChanged(el: ElementFinder, tempVar: any) {
  let isReady = false;
  const timer = setInterval(async() => {
    try {
      if (await el.getText() !== tempVar) {
        isReady = true;
        clearInterval(timer);
      }
    } catch(e) {
      isReady= true;
      clearInterval(timer);
    }
  }, 3e2);
  return browser.wait(() => isReady, defaultTimeout);
}

export async function browserClick(el: ElementFinder) {
  await browser.actions().mouseMove(el).perform();
  return browser.actions().click().perform();
}
