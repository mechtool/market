const defaultConfig = require('./protractor.conf');
let devConfig = {
  params: {
    production: false,
    credentials: {
      userLoginWithoutAvailableOrganizations: '1cmarket-e2e-user1',
      userLoginWithAvailableOrganizations: '1cmarket-e2e-user2',
      userLoginForMySales: '1cmarket-e2e-user3',
      userPassword: 'aA123321'
    },
    defaultTimeout: 1e4,
    defaultSupplierNameINN: '1828011980',
    defaultOrganizationINN: '7604246289',
    defaultOrganizationKPP: '760401001',
    defaultOrganizationName: 'ООО "КДЛ ЯРОСЛАВЛЬ-ТЕСТ"',
    defaultContactName: 'Иван Маркет',
    defaultContactPhone: '9512223344',
    defaultContactEmail: 'market.e2e@yandex.ru',
    defaultDeliveryCity: 'Москва г',
    defaultDeliveryStreet: 'Лермонтовская ул',
    defaultDeliveryHouse: '17',
    defaultCommentForSupplier: 'Прошу привезти заказ как можно быстрее. Адрес - Дмитровское шоссе, дом 9, 412 каб., г. Москва',
    defaultOrganizationIPNamePattern: 'ИП Тесто-',
    defaultPriceListExternalUrl: 'https://www.dropbox.com/scl/fi/r2b4icdrz9tiyydahryoh/price-list.xlsx?dl=1&rlkey=k4584kytfxxffupb7mr17hinu',
  },
};
exports.config = Object.assign(defaultConfig.config, devConfig);
