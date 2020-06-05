import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { LOCALE_ID, APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  registerLocaleData,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import ru from '@angular/common/locales/ru';
import { AppRoutingModule } from './app-routing.module';
import { ApiFactory } from './config/api.factory';
import {
  SetupServicesModule,
  PipesModule,
  CommonServicesModule,
  CardModule,
  NomenclatureCardModule,
  UserService,
} from '#shared/modules';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';

import { AppComponent } from './app.component';
import { RootComponent } from './routes/root/root.component';
import {
  BreadcrumbsModule,
  NavbarComponent,
  NavbarMobileNavComponent,
  NavbarNavComponent,
} from './routes/root/components';

import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

registerLocaleData(ru);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
);

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
      deps: [UserService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
