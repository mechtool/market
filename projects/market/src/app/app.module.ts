import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_INITIALIZER, DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd/i18n';
import { AppRoutingModule } from './app-routing.module';
import { ApiFactory, APP_CONFIG } from './config';
import { CommonServicesModule } from '#shared/modules/common-services';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { AppComponent } from './app.component';
import { RootComponent } from './routes/root/root.component';
import { NavbarComponent, NavbarMobileNavComponent, NavbarNavComponent } from './routes/root/components';
import { BreadcrumbsModule } from './routes/root/components/breadcrumbs';
import { CookieAgreementModule } from './routes/root/components/cookie-agreement';
import { SetupServicesModule } from '#shared/modules/setup-services';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';
import { environment } from '#environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

registerLocaleData(ru);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

@NgModule({
  declarations: [AppComponent, RootComponent, NavbarComponent, NavbarMobileNavComponent, NavbarNavComponent],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    PortalModule,
    OverlayModule,
    RecaptchaV3Module,
    NzIconModule,
    BreadcrumbsModule,
    CookieAgreementModule,
    SharedDepsModule,
    SetupServicesModule.forRoot(),
    CommonServicesModule.forRoot(),
  ],
  providers: [
    { provide: 'googleTagManagerId', useValue: environment.gtmID },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaV3SiteKey },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: NZ_I18N, useValue: ru_RU },
    { provide: NZ_ICONS, useValue: icons },
    { provide: APP_CONFIG, useValue: { retryNum: 3, retryDelay: 300, debounceTime: 300 } },
    {
      provide: APP_INITIALIZER,
      useFactory: ApiFactory,
      deps: [Injector],
      multi: true,
    },
    { provide: DEFAULT_CURRENCY_CODE, useValue: '' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
