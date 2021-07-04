import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '#environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(() => {
    const spinnerEl = <HTMLDivElement>document.querySelector('.spinner');
    const maintenanceEl = <HTMLDivElement>document.querySelector('.maintenance');
    spinnerEl.style.display = 'none';
    maintenanceEl.style.display = 'flex';
  });
