import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { SsoTicketGuard } from './sso-ticket.guard';
import { DelayedPreloadingStrategy } from './preloading-strategy';
import { ApiInterceptor } from './api-interceptor';

@NgModule()
export class SetupServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SetupServicesModule,
      providers: [
        AuthGuard,
        SsoTicketGuard,
        DelayedPreloadingStrategy,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true,
        },
      ],
    };
  }
}

