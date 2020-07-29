import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// import cssVarsPonyfill from 'css-vars-ponyfill';

// cssVarsPonyfill({
//   include: 'style',
//   onlyLegacy: false,
//   watch: true,
//   onComplete(cssText, styleNode, cssVariables) {
//     console.log(cssText);
//   }
// });

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
