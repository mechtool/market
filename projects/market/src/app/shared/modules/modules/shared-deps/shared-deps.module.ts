import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule, ScrollHooks } from 'ng-lazyload-image';
import { NgxMaskModule } from 'ngx-mask';
import { PipesModule } from '#shared/modules/pipes/pipes.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ErrorTemplateInjectorModule } from "#shared/modules/components/error-template-injector";

@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule,
    PipesModule,
    ErrorTemplateInjectorModule,
    NgxMaskModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
  ],
  exports: [
    LazyLoadImageModule,
    PipesModule,
    NgxMaskModule,
    NgIdleKeepaliveModule,
    ErrorTemplateInjectorModule,
  ],
  providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }]
})
export class SharedDepsModule {
}

