const defaultConfig = require('./protractor.conf');
let devConfig = {
  params: {
    production: false,
    credentials: {
      userLoginWithoutAvailableOrganizations: '1cmarket-e2e-user1',
      userLoginWithAvailableOrganizations: '1cmarket-e2e-user2',
      userPassword: 'aA123321'
    },
    defaultTimeout: 1e4,
    defaultSupplierNameINN: '1828011980',
    defaultOrganizationINN: '7604246289',
    defaultOrganizationKPP: '760401001',
    defaultOrganizationName: 'ООО "КДЛ ЯРОСЛАВЛЬ-ТЕСТ"',
    defaultContactName: 'Федор Тестович',
    defaultContactPhone: '9512223344',
    defaultContactEmail: 'testovich.fedor@ftestovich.ru',
    defaultDeliveryCity: 'Москва г',
    defaultDeliveryStreet: 'Лермонтовская ул',
    defaultDeliveryHouse: '17',
    defaultCommentForSupplier: 'Прошу привезти заказ как можно быстрее. Адрес - Дмитровское шоссе, дом 9, 412 каб., г. Москва',
    defaultOrganizationIPNamePattern: 'ИП Тесто-',
  },
};
exports.config = Object.assign(defaultConfig.config, devConfig);
