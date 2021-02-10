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
  exclude: ['./src/load-test/*.ts'],
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
          '--no-sandbox',
          '--log-level=2',
          '--ignore-certificate-errors',
          '--allow-insecure-localhost',
          '--start-maximized',
          '--window-size=1350,800'
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
      userLogin: 'testUser704',
      userPassword: 'doNotChangePassword!'
    },
    defaultTimeout: 1e4,
    defaultSupplierNamePart: 'Седов',
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

