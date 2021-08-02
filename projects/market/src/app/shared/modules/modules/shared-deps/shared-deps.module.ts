import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule, ScrollHooks } from 'ng-lazyload-image';
import { NgxMaskModule } from 'ngx-mask';
import { PipesModule } from '../../../../shared/modules/pipes/pipes.module';
import { ErrorTemplateInjectorModule } from '../../../../shared/modules/components/error-template-injector';
const imp = [
  CommonModule,
  LazyLoadImageModule,
  PipesModule,
  ErrorTemplateInjectorModule,
  NgxMaskModule.forRoot()
];
const exp = [
  LazyLoadImageModule,
  PipesModule,
  NgxMaskModule,
  ErrorTemplateInjectorModule,
];
(async () => {
  try {
    if(document) {
      const m = await import('@ng-idle/keepalive');
      imp.push(m.NgIdleKeepaliveModule.forRoot());
      exp.push(m.NgIdleKeepaliveModule);
    }
  }catch (err) {}
})();


@NgModule({
  imports : imp,
  exports : exp,
  providers: [{ provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }]
})
export class SharedDepsModule {}

