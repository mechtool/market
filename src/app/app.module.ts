import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  LOCALE_ID,
  APP_INITIALIZER,
  NgModule
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  registerLocaleData,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import ru from '@angular/common/locales/ru';
import { AppRoutingModule } from './app-routing.module';
import { ApiFactory } from './config/api.factory';
import {
  SetupServicesModule,
  PipesModule,
  CommonServicesModule,
  InputQtyModule,
  ProductCardModule,
} from '#shared/modules';

import { AppComponent } from './app.component';
import { RootComponent } from './routes/root/root.component';
import {
  NavbarComponent,
  NavbarLogoComponent,
  NavbarMobileNavComponent,
  NavbarNavComponent,
} from './routes/root/components';

registerLocaleData(ru);

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    NavbarComponent,
    NavbarLogoComponent,
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
    PipesModule,
    InputQtyModule,
    ProductCardModule,
    SetupServicesModule.forRoot(),
    CommonServicesModule.forRoot(),
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: LOCALE_ID, useValue: 'ru' },
    {
      provide: APP_INITIALIZER,
      useFactory: ApiFactory,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
