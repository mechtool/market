import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { PipesModule } from '#shared/modules/pipes';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
    PagesRoutingModule,
  ],
  exports: [PagesComponent],
  declarations: [PagesComponent],
})
export class PagesModule {
}
