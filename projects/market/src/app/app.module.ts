import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { APP_INITIALIZER, DEFAULT_CURRENCY_CODE, Injector, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { AppRoutingModule } from './app-routing.module';
import { ApiFactory, APP_CONFIG } from './config';
import { CommonServicesModule } from '#shared/modules/common-services';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';

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
import { CardModule, NomenclatureCardModule } from '#shared/modules/components';
import { SetupServicesModule } from '#shared/modules/setup-services';
import { LineClampModule } from '#shared/modules';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd/i18n';
import { environment } from '#environments/environment';
import { SharedDepsModule } from '#shared/modules/modules/shared-deps/shared-deps.module';

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
    NoopAnimationsModule,
    PortalModule,
    OverlayModule,
    RecaptchaV3Module,
    NzIconModule,
    CardModule,
    LineClampModule,
    NgZorroAntdMobileModule,
    NomenclatureCardModule,
    SetupServicesModule.forRoot(),
    CommonServicesModule.forRoot(),
    BreadcrumbsModule,
    CookieAgreementModule,
    FeedbackModule,
    SharedDepsModule,
  ],
  providers: [
    { provide: 'googleTagManagerId', useValue: environment.gtmID },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6Ld7utQZAAAAAFFHDpsosgD-fw3jA0xwD_f25wZ1' },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: NZ_I18N, useValue: ru_RU },
    { provide: NZ_ICONS, useValue: icons },
    { provide: LOCAL_PROVIDER_TOKEN, useValue: ru_RU_Mobile },
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
