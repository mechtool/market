import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { AuthModalService } from './auth-modal.service';
import { SsoTicketGuard } from './sso-ticket.guard';
import { BreadcrumbsGuard } from './breadcrumbs.guard';
import { DelayedPreloadingStrategy } from './preloading-strategy';
import { ApiInterceptor } from './api-interceptor';
import { NzModalModule } from 'ng-zorro-antd';
import { AuthOrganizationGuard } from './auth-organization.guard';

@NgModule({
  imports: [
    NzModalModule
  ]
})
export class SetupServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SetupServicesModule,
      providers: [
        AuthGuard,
        AuthOrganizationGuard,
        AuthModalService,
        SsoTicketGuard,
        BreadcrumbsGuard,
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

