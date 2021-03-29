import { TargetOptions } from '@angular-builders/custom-webpack';
import * as cheerio from 'cheerio';
import * as minifier from 'html-minifier';

export default (targetOptions: TargetOptions, indexHtml: string) => {
  const $ = cheerio.load(indexHtml);
  const apiUrl = setApiUrl(targetOptions);
  appendLinks($, apiUrl);
  appendGoogleVerification($, targetOptions);
  const result = minifyHtml($, targetOptions);
  return result;
};

function setApiUrl(targetOptions: TargetOptions) {
  let apiUrl = null;
  switch (targetOptions.configuration) {
    case 'production':
      apiUrl = 'https://api.1cbn.ru';
      break;
    case 'stage':
      apiUrl = 'https://bnet-api-stage.1c.ru';
      break;
    case 'dev':
      apiUrl = 'http://1cbn-api.dev.dept07';
      break;
  }
  return apiUrl;
}

function appendLinks(loadedCheerio: any, apiUrl: string): void {
  if (apiUrl) {
    const linkDNSPrefetch = `<link rel="dns-prefetch" href="${apiUrl}"/>`;
    const linkPreconnect = `<link rel="preconnect" href="${apiUrl}"/>`;
    loadedCheerio('head').append(linkDNSPrefetch);
    loadedCheerio('head').append(linkPreconnect);
  }
}

function appendGoogleVerification(loadedCheerio: any, targetOptions: TargetOptions): void {
  if (targetOptions.configuration === 'production') {
    const googleVerification = `<meta name="google-site-verification" content="W_gnVHzfDQY2F9LFHeSRq-rJ0mbTHuEpazKtgr8rOCo"/>`;
    loadedCheerio('head').append(googleVerification);
  }
}

function minifyHtml(loadedCheerio: any, targetOptions: TargetOptions) {
  if (targetOptions.configuration === 'production') {
    const minified = minifier.minify(loadedCheerio.html(), {
      removeComments: true,
      removeAttributeQuotes: true,
      collapseWhitespace: true,
    });
    return minified;
  }
  return loadedCheerio.html();
}
