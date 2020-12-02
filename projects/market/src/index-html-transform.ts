import { TargetOptions } from '@angular-builders/custom-webpack';
import * as cheerio from 'cheerio';
import * as minfier from 'html-minifier';
import { environment } from './environments/environment.prod';

export default (targetOptions: TargetOptions, indexHtml: string) => {
  if (targetOptions.configuration.includes('production')) {
    const metrikaID = environment.metrikaID;
    const $ = cheerio.load(indexHtml);
    const yandexMetrikaCounter = `
    <script type="text/javascript" >
       (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
       m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
       (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

       ym(${metrikaID}, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            ecommerce:"dataLayer"
       });
    </script>
   `;

    $('head').append(yandexMetrikaCounter);

    const minified = minfier.minify($.html(), {
      removeComments: true,
      removeAttributeQuotes: true,
      collapseWhitespace: true,
    });

    return minified;
  }

  return indexHtml;
};
