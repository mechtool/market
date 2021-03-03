import { TargetOptions } from '@angular-builders/custom-webpack';
import * as cheerio from 'cheerio';
import * as minfier from 'html-minifier';

export default (targetOptions: TargetOptions, indexHtml: string) => {
  if (targetOptions.configuration.includes('production')) {
    const $ = cheerio.load(indexHtml);
    const minified = minfier.minify($.html(), {
      removeComments: true,
      removeAttributeQuotes: true,
      collapseWhitespace: true,
    });
    return minified;
  }
  return indexHtml;
};
