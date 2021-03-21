// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: ['./src/**/*.e2e-spec.ts'],
  useAllAngular2AppRoots: true,
  SELENIUM_PROMISE_MANAGER: false,
  multiCapabilities: [
    {
      browserName: 'chrome',
      acceptInsecureCerts: true,
      chromeOptions: {
        args: [
          '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-web-security',
          '--no-sandbox',
          '--log-level=2',
          '--ignore-certificate-errors',
          '--allow-insecure-localhost',
          '--start-maximized',
          '--window-size=1850,800'
        ],
        binary: puppeteer.executablePath(),
      },
    },
  ],
  directConnect: true,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 120000,
    print: function () {},
  },
  restartBrowserBetweenTests: false,
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
    defaultOrganizationName: 'ООО Тесто №1',
    defaultContactName: 'Федор Тестович',
    defaultContactPhone: '9512223344',
    defaultContactEmail: 'testovich.fedor@ftestovich.ru',
    defaultDeliveryCity: 'Москва г',
    defaultDeliveryStreet: 'Лермонтовская ул',
    defaultOrganizationIPNamePattern: 'ИП Тесто-',
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json'),
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    // Если нужно показать время выполнения, раскомментировать нижеуказанный addReporter
    // jasmine.getEnv().addReporter({
    //   specStarted: result => {
    //     jasmine.currentTest = result;
    //   },
    //   specDone: (result) => {
    //     // console.log(`Время выполнения: ${jasmine.currentTest.duration}\n`);
    //     delete jasmine.currentTest;
    //   },
    // });
  },
};

