import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MainComponent,
  ProductsComponent,
  ProductComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  }, {
    path: 'products',
    component: ProductsComponent,
  }, {
    path: 'product/:id',
    component: ProductComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ProductsRoutingModule {}
