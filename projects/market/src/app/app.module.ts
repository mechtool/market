import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_INITIALIZER, DEFAULT_CURRENCY_CODE, Injector, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { AppRoutingModule } from './app-routing.module';
import { ApiFactory } from './config/api.factory';
import { CommonServicesModule } from '#shared/modules/common-services';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgxMaskModule } from 'ngx-mask';

import { AppComponent } from './app.component';
import { RootComponent } from './routes/root/root.component';
import {
  BreadcrumbsModule,
  CookieAgreementModule,
  FeedbackModule,
  NavbarComponent,
  NavbarMobileNavComponent,
  NavbarNavComponent,
} from './routes/root/components';

import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { LOCAL_PROVIDER_TOKEN, NgZorroAntdMobileModule, ru_RU as ru_RU_Mobile } from 'ng-zorro-antd-mobile';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { PipesModule } from '#shared/modules/pipes';
import { CardModule, NomenclatureCardModule } from '#shared/modules/components';
import { SetupServicesModule } from '#shared/modules/setup-services';
import { LineClampModule } from '#shared/modules';
import { MetrikaModule } from 'ng-yandex-metrika';
import { APP_CONFIG } from './config/app.config.token';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd/i18n';
import { environment } from '#environments/environment';

registerLocaleData(ru);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

@NgModule({
  entryComponents: [NavbarComponent, NavbarMobileNavComponent, NavbarNavComponent],
  declarations: [AppComponent, RootComponent, NavbarComponent, NavbarMobileNavComponent, NavbarNavComponent],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PortalModule,
    OverlayModule,
    RecaptchaV3Module,
    NzIconModule,
    PipesModule,
    CardModule,
    LineClampModule,
    NgZorroAntdMobileModule,
    NomenclatureCardModule,
    NgxMaskModule.forRoot(),
    SetupServicesModule.forRoot(),
    CommonServicesModule.forRoot(),
    BreadcrumbsModule,
    CookieAgreementModule,
    FeedbackModule,
    MetrikaModule.forRoot({
      id: environment.metrikaID,
      webvisor: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      ecommerce: 'dataLayer',
    }),
  ],
  providers: [
    { provide: 'googleTagManagerId', useValue: environment.gtmID },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6Ld7utQZAAAAAFFHDpsosgD-fw3jA0xwD_f25wZ1' },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: NZ_I18N, useValue: ru_RU },
    { provide: NZ_ICONS, useValue: icons },
    { provide: LOCAL_PROVIDER_TOKEN, useValue: ru_RU_Mobile },
    { provide: APP_CONFIG, useValue: { retryNum: 3, retryDelay: 300 } },
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
