import { browser, ElementFinder, protractor, ProtractorExpectedConditions } from 'protractor';

export const {
  defaultTimeout, defaultSupplierNameINN, defaultOrganizationINN, defaultOrganizationKPP,
  defaultOrganizationName, defaultContactName, defaultContactPhone, defaultContactEmail,
  defaultDeliveryCity, defaultDeliveryStreet, defaultDeliveryHouse, defaultCommentForSupplier, defaultOrganizationIPNamePattern,
} = browser.params;

export function randomItem(index: number): number {
  return Math.floor(Math.random() * Math.floor(index));
}

export function randomCategory(): number {
  const categories = [985, 1154, 3275];
  return categories[randomItem(categories.length)];
}

export function randomQuery(first?: boolean): string {
  if (first) {
    return ['бумага', 'стул', 'перчатки'][randomItem(3)];
  }
  return ['вода', 'хлеб', 'молоко'][randomItem(3)];
}

export const until: ProtractorExpectedConditions = protractor.ExpectedConditions;

export async function navigateTo(url: string = browser.baseUrl): Promise<any> {
  return browser.get(url) as Promise<any>;
}

export async function restart(): Promise<any> {
  return browser.restart() as Promise<any>;
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

export function generateINNforIP(): string {
  const region = zeros(String(Math.floor((Math.random() * 92) + 1)),2);
  const inspection = zeros(String(Math.floor((Math.random() * 48) + 52)),2);
  const num = zeros(String(Math.floor((Math.random() * 999999) + 1)),6);
  let result = region + inspection + num;

  let kontr = String(((
    7*result[0] + 2*result[1] + 4*result[2] +
    10*result[3] + 3*result[4] + 5*result[5] +
    9*result[6] + 4*result[7] + 6*result[8] +
    8*result[9]
  ) % 11) % 10);
  if (kontr === '10') {
    kontr = '0';
  }
  result = result + kontr;
  kontr = String(((
    3*result[0] +  7*result[1] + 2*result[2] +
    4*result[3] + 10*result[4] + 3*result[5] +
    5*result[6] +  9*result[7] + 4*result[8] +
    6*result[9] +  8*result[10]
  ) % 11) % 10);
  if (kontr === '10') {
    kontr = '0';
  }
  result = result + kontr;

  return result;

  function zeros(str: any, lng: number) {
    const factlength = str.length;
    if (factlength < lng) {
      for (let i = 0; i < (lng-factlength); i++)
      {
        str = `0${str}`;
      }
    }
    return str;
  }
}

