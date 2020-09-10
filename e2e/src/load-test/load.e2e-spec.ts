import { authorizedUserAddsProductsToCartAndPacesOrder, unauthorizedUserSearches } from './load.tests';
import { browser } from 'protractor';

browser.driver.manage().window().maximize();

describe('Сценарии: Нагрузочного тестирования', async() => {
  for (let i = 0; i < 5; i++) {
    /**
     * Основной сценарий заказа
     */
    describe('Сценарий: Авторизованный пользователь добавляет в корзину товары и делает заказ', async() => {
      authorizedUserAddsProductsToCartAndPacesOrder();
    });

    /**
     * Основной сценарий поиска
     */
    describe('Сценарий: Неавторизованный пользователь выполняет поиск', async() => {
      unauthorizedUserSearches();
    });
  }
});
