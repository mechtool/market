import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MainComponent,
  ProductComponent,
  Code404Component,
} from './components';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  }, {
    path: '404',
    component: Code404Component,
  }, {
    path: 'product/:id',
    component: ProductComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ProductRoutingModule {}
