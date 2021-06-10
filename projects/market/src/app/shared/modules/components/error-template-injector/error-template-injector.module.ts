import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ErrorTemplateInjectorComponent } from './error-template-injector.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [ErrorTemplateInjectorComponent],
  declarations: [ErrorTemplateInjectorComponent],
})
export class ErrorTemplateInjectorModule {
}
