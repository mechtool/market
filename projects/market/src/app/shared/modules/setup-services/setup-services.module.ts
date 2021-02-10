import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { AuthModalService } from './auth-modal.service';
import { BreadcrumbsGuard } from './breadcrumbs.guard';
import { DelayedPreloadingStrategy } from './preloading-strategy';
import { ApiInterceptor } from './api-interceptor';
import { AuthOrganizationGuard } from './auth-organization.guard';
import { AuthOrRegDecisionMakerModule } from '#shared/modules/components/auth-or-reg-decision-maker/auth-or-reg-decision-maker.module';
import { EmptyOrganizationsInfoModule } from '#shared/modules/components/empty-organizations-info/empty-organizations-info.module';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  imports: [NzModalModule, AuthOrRegDecisionMakerModule, EmptyOrganizationsInfoModule],
})
export class SetupServicesModule {
  static forRoot(): ModuleWithProviders<SetupServicesModule> {
    return {
      ngModule: SetupServicesModule,
      providers: [
        AuthGuard,
        AuthOrganizationGuard,
        AuthModalService,
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
