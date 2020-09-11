import { AppLoadPage } from './load.po';
import { expectedConditions, navigateTo } from '../utils/utils';
import { browser } from 'protractor';

const userLogin = 'bn-basic-user';
const userPassword = '123Qwerty';

function randomItem(index: number): number {
  return Math.floor(Math.random() * Math.floor(index));
}

function randomCategory(): number {
  const categories = [985, 1154, 3275];
  return categories[randomItem(categories.length)];
}

function randomQuery(): string {
  const queries = ['вода', 'хлеб', 'молоко'];
  return queries[randomItem(queries.length)];
}

export function authorizedUserAddsProductsToCartAndPacesOrder() {
  const page = new AppLoadPage();
  const expectedCondition = expectedConditions();

  beforeAll(async() => {
    await browser.driver.manage().window().setSize(1350, 800);
    await browser.waitForAngularEnabled(false);
    await navigateTo();
  });

  it('Шаг 1: Пользователь заходит на главную страницу и принимает пользовательское соглашение', async() => {
    console.log('Шаг 1: Начал выполнение');
    const time1 = Date.now();

    await browser.sleep(10000);
    await page.getCloseCookie().isPresent().then(async(isCookie) => {
        if (isCookie) {
          console.log('Информационное сообщение успешно закрыто');
          await page.getCloseCookie().click();
        }
      }, (error) => {
        console.error('Ошибка при закрытии информационного соглашения', error);
      },
    );

    const time2 = Date.now();
    console.log(`Шаг 1: Выполнен успешно за ${time2 - time1} мс`);
  });

  it('Шаг 2: Пользователь проходит аутентификацию', async() => {
    console.log('Шаг 2: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.presenceOf(page.getNavBarPersonalAccountElement()), 10000);

    await page.getNavBarPersonalAccountElement().click();
    await browser.sleep(10000);

    await page.getNavBarLoginElement().isPresent().then(async(isPresent) => {
      if (isPresent) {

        await page.getNavBarLoginElement().click();
        await browser.sleep(10000);

        await page.getLoginButton().isPresent().then(async(isPresentLoginButton) => {
          if (isPresentLoginButton) {
            await page.getLoginInput().sendKeys(userLogin);
            await browser.sleep(200);
            await page.getPasswordInput().sendKeys(userPassword);
            await browser.sleep(200);
            await page.getLoginButton().click();
          }
        });

        await browser.sleep(10000);

        await browser.wait(expectedCondition.presenceOf(page.getNavBarPersonalAccountElement()), 10000);

        await page.getNavBarPersonalAccountElement().click();
      }
    });

    const time2 = Date.now();
    console.log(`Шаг 2: Выполнен успешно за ${time2 - time1} мс`);
  });

  it('Шаг 3: Пользователь указывает параметры поиска продуктов с картинками и от поставщика ООО "МЕТРО Кэш энд Керри Россия"', async() => {
    console.log('Шаг 3: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.presenceOf(page.getSearchBar()), 10000);

    await page.getSearchBarFilterButton().click();
    await browser.sleep(3000);

    await page.getSearchBarFilterOrganizationInput().sendKeys('метро');
    await browser.sleep(2000);

    await page.getListAutoOptions().get(0).click();
    await browser.sleep(1000);

    await page.getCheckboxWithImages().click();
    await browser.sleep(1000);

    await page.getSaveFiltersButton().click();
    await browser.sleep(10000);

    const time2 = Date.now();
    console.log(`Шаг 3: Выполнен успешно за ${time2 - time1} мс`);
  });

  it('Шаг 4: Пользователь переходит в произвольно выбранный продукт из найденных и проверяет наличие в нем торговых предложений',
    async() => {
      console.log('Шаг 4: Начал выполнение');
      const time1 = Date.now();

      await browser.wait(expectedCondition.stalenessOf(page.getSpinnerSpinning()), 10000);

      await page.getAllProductCards().get(0).click();
      await browser.sleep(10000);

      const time2 = Date.now();
      console.log(`Шаг 4: Выполнен успешно за ${time2 - time1} мс`);
    });

  it('Шаг 5: Пользователь переходит в произвольно выбиранное торговое предложение из найденых', async() => {
    console.log('Шаг 5: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.stalenessOf(page.getSpinnerSpinning()), 10000);

    await page.getAllTradeOfferCards().get(0).click();
    await browser.sleep(10000);

    const time2 = Date.now();
    console.log(`Шаг 5: Выполнен успешно за ${time2 - time1} мс`);
  });

  it('Шаг 6: Пользователь переходит в магазин поставщика ООО "МЕТРО Кэш энд Керри Россия"', async() => {
    console.log('Шаг 6: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.presenceOf(page.getSupplierNameRouterLink()), 10000);

    await page.getSupplierNameRouterLink().click();
    await browser.sleep(10000);

    await browser.wait(expectedCondition.presenceOf(page.getSuppliersTradeOffersList()), 10000);

    const time2 = Date.now();
    console.log(`Шаг 6: Выполнен успешно за ${time2 - time1} мс`);
  });

  it('Шаг 7: Пользователь указывает параметры поиска торговых предложений с картинками', async() => {
    console.log('Шаг 7: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.presenceOf(page.getSearchBar()), 10000);

    await page.getSearchBarFilterButton().click();
    await browser.sleep(3000);

    await page.getCheckboxWithImages().click();
    await browser.sleep(1000);

    await page.getSaveFiltersButton().click();
    await browser.sleep(10000);

    const time2 = Date.now();
    console.log(`Шаг 7: Выполнен успешно за ${time2 - time1} мс`);
  });

  it('Шаг 8: Пользователь добавляет 5 торговых предложений в корзину', async() => {
    console.log('Шаг 8: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.presenceOf(page.getSuppliersTradeOffersList()), 10000);

    await page.getProductSideToCartButtonInTradeOfferPage().then(async(items) => {
      await page.getProductSideToCartButtonInTradeOfferPage().get(0).click();
      await browser.sleep(1000);
      await page.getProductSideToCartButtonInTradeOfferPage().get(1).click();
      await browser.sleep(1000);
      await page.getProductSideToCartButtonInTradeOfferPage().get(2).click();
      await browser.sleep(1000);
      await page.getProductSideToCartButtonInTradeOfferPage().get(3).click();
      await browser.sleep(1000);
      await page.getProductSideToCartButtonInTradeOfferPage().get(5).click();
      await browser.sleep(1000);
    });

    const time2 = Date.now();
    console.log(`Шаг 8: Выполнен успешно за ${time2 - time1} мс`);
  });

  it('Шаг 9: Пользователь переходит в корзину', async() => {
    console.log('Шаг 9: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.presenceOf(page.getCartElement()), 10000);

    await page.getCartElement().click();
    await browser.sleep(10000);

    const time2 = Date.now();
    console.log(`Шаг 9: Выполнен успешно за ${time2 - time1} мс`);
  });

  it('Шаг 10: Пользователь оформляет заказ', async() => {
    console.log('Шаг 10: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.presenceOf(page.getMarketCartOrder()), 10000);
    await browser.wait(expectedCondition.presenceOf(page.getTabOrderingData()), 10000);

    await page.getTabOrderingData().click();
    await browser.sleep(200);
    await page.getDeliveryAddressInput().sendKeys('москва дмитровское 9');
    await browser.sleep(1000);
    await page.getListAutoOptions().get(0).click();
    await browser.sleep(200);
    await page.getContactPhoneInput().sendKeys('(111) 111 11 11');
    await browser.sleep(1000);
    await browser.executeScript('window.scrollTo(0, 1000);');
    await browser.sleep(500);
    await page.getCheckoutButton().click();
    await browser.sleep(10000);

    const time2 = Date.now();
    console.log(`Шаг 10: Выполнен успешно за ${time2 - time1} мс`);
  });

  it('Шаг 11: Пользователь переходит на страницу "Мои заказы"', async() => {
    console.log('Шаг 11: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.presenceOf(page.getNavBarPersonalAccount()), 10000);

    await page.getNavBarPersonalAccount().click();
    await browser.sleep(2000);

    const time2 = Date.now();
    console.log(`Шаг 11: Выполнен успешно за ${time2 - time1} мс`);
  });
}

export function unauthorizedUserSearches() {
  const page = new AppLoadPage();
  const expectedCondition = expectedConditions();

  beforeAll(async() => {
    await browser.waitForAngularEnabled(false);
    await navigateTo();
  });

  it('Шаг 1: Пользователь заходит на главную страницу и принимает пользовательское соглашение', async() => {
    console.log('Шаг 1: Начал выполнение');
    const time1 = Date.now();

    await browser.sleep(10000);
    await page.getCloseCookie().isPresent().then(async(isCookie) => {
      if (isCookie) {
        console.log('Информационное сообщение успешно закрыто');
        await page.getCloseCookie().click();
      }
    }, ((error) => {
      console.error('Ошибка при закрытии информационного соглашения', error);
    }));

    const time2 = Date.now();
    console.log(`Шаг 1: Выполнен успешно за ${time2 - time1} мс`);
  });


  it('Шаг 2: Пользователь вводит поисковой запрос и видит, что доступны результаты поиска', async() => {
    console.log('Шаг 2: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.presenceOf(page.getSearchBar()), 10000);

    await page.getSearchBarInput().sendKeys(randomQuery());
    await browser.sleep(1000);
    await page.getSearchBarButton().click();
    await browser.sleep(10000);

    const time2 = Date.now();
    console.log(`Шаг 2: Выполнен успешно за ${time2 - time1} мс`);
  });


  it('Шаг 3: Пользователь переходит в произвольно выбранный продукт из найденных и проверяет наличие в нем торговых предложений',
    async() => {
      console.log('Шаг 3: Начал выполнение');
      const time1 = Date.now();

      await browser.wait(expectedCondition.stalenessOf(page.getSpinnerSpinning()), 10000);
      await browser.wait(expectedCondition.presenceOf(page.getSearchResults()), 10000);

      await page.getAllProductCards().then(async(items) => {
        const index = items.length ? randomItem(items.length / 2) : 0;
        console.log(`Всего найдено ${items.length} продуктов на странице`);
        console.log(`Выбран ${index} продукт на странице`);
        const product = page.getAllProductCards().get(index).$('.cover');
        await browser.wait(expectedCondition.stalenessOf(page.getSpinnerSpinning()), 10000);
        await product.click();
      }, ((error) => {
        console.error('Ошибка при выборе продукта', error);
      }));
      await browser.sleep(10000);

      const time2 = Date.now();
      console.log(`Шаг 3: Выполнен успешно за ${time2 - time1} мс`);
    });


  it('Шаг 4: Пользователь переходит в произвольно выбиранное торговое предложение из найденых', async() => {
    console.log('Шаг 4: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.presenceOf(page.getTradeOfferCardList()), 10000);
    await browser.wait(expectedCondition.stalenessOf(page.getSpinnerSpinning()), 10000); // todo проверить есть он или нет

    await page.getAllTradeOfferCards().then(async(items) => {
      const index = items.length ? randomItem(items.length) : 0;
      console.log(`Всего найдено ${items.length} торговых предложений на странице`);
      console.log(`Выбрано ${index} торговое предложение на странице`);
      const newVar = page.getAllTradeOfferCards().get(index);
      await browser.actions().mouseMove(newVar).perform();
      await browser.actions().click().perform();
    }, ((error) => {
      console.error('Ошибка при выборе торгового предложения', error);
    }));
    await browser.sleep(10000);

    const time2 = Date.now();
    console.log(`Шаг 4: Выполнен успешно за ${time2 - time1} мс`);
  });


  it('Шаг 5: Пользователь переходит нажимая по хлебным крошкам на страницу одной из категорий торгового предложения',
    async() => {
      console.log('Шаг 5: Начал выполнение');
      const time1 = Date.now();

      await browser.wait(expectedCondition.presenceOf(page.getProductGallery()), 10000);

      await page.getAllBreadcrumbItems().then(async(items) => {
        if (items.length) {
          const index = randomItem(items.length);
          console.log(`Всего найдено ${items.length} экземпляров хлебных крошек на странице`);
          console.log(`Выбрана по счету ${index} категория в хлебных крошках`);
          const newVar = page.getAllBreadcrumbItems().get(index);
          await browser.actions().mouseMove(newVar).perform();
          await browser.actions().click().perform();

        } else {
          browser.get(`/category/${randomCategory()}`);
        }
      }, ((error) => {
        console.error('Ошибка при выборе категории в хлебных крошках', error);
      }));
      await browser.sleep(10000);

      const time2 = Date.now();
      console.log(`Шаг 5: Выполнен успешно за ${time2 - time1} мс`);
    });


  it(`Шаг 6: Пользователь переходит в произвольно выбранный продукт из найденных и проверяет наличие в нем торговых предложений`,
    async() => {
      console.log('Шаг 6: Начал выполнение');
      const time1 = Date.now();

      await browser.wait(expectedCondition.presenceOf(page.getSearchResults()), 10000);
      await browser.wait(expectedCondition.stalenessOf(page.getSpinnerSpinning()), 10000);

      await page.getAllProductCards().then(async(items) => {
        const index = items.length ? randomItem(items.length / 2) : 0;
        console.log(`Всего найдено ${items.length} продуктов на странице`);
        console.log(`Выбран ${index} продукт на странице`);
        const newVar = page.getAllProductCards().get(index);
        await browser.actions().mouseMove(newVar).perform();
        await browser.wait(expectedCondition.stalenessOf(page.getSpinnerSpinning()), 10000);
        await browser.actions().click().perform();
      }, ((error) => {
        console.error('Ошибка при выборе продукта', error);
      }));
      await browser.sleep(10000);

      const time2 = Date.now();
      console.log(`Шаг 6: Выполнен успешно за ${time2 - time1} мс`);
    });


  it('Шаг 7: Пользователь переходит в произвольно выбиранное торговое предложение из найденых', async() => {
    console.log('Шаг 7: Начал выполнение');
    const time1 = Date.now();

    await browser.wait(expectedCondition.presenceOf(page.getProductGallery()), 10000);

    await page.getAllTradeOfferCards().isPresent().then(async(isPresent) => {
      if (isPresent) {
        await page.getAllTradeOfferCards().then(async(items) => {
          const index = items.length ? randomItem(items.length) : 0;
          console.log(`Выбрано ${index} торговое предложение на странице`);
          const newVar = page.getAllTradeOfferCards().get(index);
          await browser.actions().mouseMove(newVar).perform();
          await browser.actions().click().perform();
        }, ((error) => {
          console.error('Ошибка при выборе торгового предложения', error);
        }));
      }
    });

    const time2 = Date.now();
    console.log(`Шаг 7: Выполнен успешно за ${time2 - time1} мс`);
  });
}

