import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy, registerLocaleData, } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { AppRoutingModule } from './app-routing.module';
import { ApiFactory } from './config/api.factory';
import {
  CardModule,
  UserService,
  CartService,
  AuthService,
  CookieService,
  CommonServicesModule,
  NomenclatureCardModule,
  PipesModule,
  SetupServicesModule,
} from '#shared/modules';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgxMaskModule } from 'ngx-mask'

import { AppComponent } from './app.component';
import { RootComponent } from './routes/root/root.component';
import {
  BreadcrumbsModule,
  NavbarComponent,
  NavbarMobileNavComponent,
  NavbarNavComponent,
} from './routes/root/components';

import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

registerLocaleData(ru);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

@NgModule({
  entryComponents: [
    NavbarComponent,
    NavbarMobileNavComponent,
    NavbarNavComponent,
  ],
  declarations: [
    AppComponent,
    RootComponent,
    NavbarComponent,
    NavbarMobileNavComponent,
    NavbarNavComponent,
  ],
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
    NzIconModule,
    PipesModule,
    CardModule,
    NomenclatureCardModule,
    NgxMaskModule.forRoot(),
    SetupServicesModule.forRoot(),
    CommonServicesModule.forRoot(),
    BreadcrumbsModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: NZ_I18N, useValue: ru_RU },
    { provide: NZ_ICONS, useValue: icons },
    {
      provide: APP_INITIALIZER,
      useFactory: ApiFactory,
      deps: [UserService, CartService, AuthService, CookieService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
