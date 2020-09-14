import { authorizedUserAddsProductsToCartAndPacesOrder, unauthorizedUserSearches } from './load.tests';

describe('Сценарии: Нагрузочного тестирования', async() => {

  const iterations = process.env.npm_config_ITERATIONS ? +process.env.npm_config_ITERATIONS : 20;

  for (let i = 0; i < iterations; i++) {
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
