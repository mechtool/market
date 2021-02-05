import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule, ScrollHooks } from 'ng-lazyload-image';
import { NgxMaskModule } from 'ngx-mask';
import { PipesModule } from '#shared/modules/pipes/pipes.module';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

@NgModule({
  imports: [
    CommonModule,
    LazyLoadImageModule,
    PipesModule,
    NgxMaskModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
  ],
  exports: [
    LazyLoadImageModule,
    PipesModule,
    NgxMaskModule,
    NgIdleKeepaliveModule,
  ],
  providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }]
})
export class SharedDepsModule {
}

