// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
const puppeteer = require('puppeteer');

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  // jasmineNodeOpts: {
  //   defaultTimeoutInterval: 120000
  // },
  allScriptsTimeout: 11000,
  specs: ['./src/**/*.e2e-spec.ts'],
  SELENIUM_PROMISE_MANAGER: false,
  multiCapabilities: [
    {
      browserName: 'chrome',
      acceptInsecureCerts: true,
      chromeOptions: {
        args: [
          // '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--log-level=2',
          '--ignore-certificate-errors',
          '--allow-insecure-localhost',
          '--start-maximized',
        ],
        // binary: puppeteer.executablePath(),
      },
    },
    {
      browserName: 'chrome',
      acceptInsecureCerts: true,
      chromeOptions: {
        args: [
          // '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--log-level=2',
          '--ignore-certificate-errors',
          '--allow-insecure-localhost',
          '--start-maximized',
        ],
        // binary: puppeteer.executablePath(),
      },
    },
    {
      browserName: 'chrome',
      acceptInsecureCerts: true,
      chromeOptions: {
        args: [
          // '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--log-level=2',
          '--ignore-certificate-errors',
          '--allow-insecure-localhost',
          '--start-maximized',
        ],
        // binary: puppeteer.executablePath(),
      },
    },
    {
      browserName: 'chrome',
      acceptInsecureCerts: true,
      chromeOptions: {
        args: [
          // '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--log-level=2',
          '--ignore-certificate-errors',
          '--allow-insecure-localhost',
          '--start-maximized',
        ],
        // binary: puppeteer.executablePath(),
      },
    },
  ],
  directConnect: true,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () {
    },
  },
  restartBrowserBetweenTests: false,
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json'),
    });
    jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
  },
};
