import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  SupplierListComponent,
  SupplierSingleComponent,
  SupplierProductComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    component: SupplierListComponent,
  }, {
    path: ':id',
    children: [
      {
        path: 'product',
        component: SupplierSingleComponent,
      }, {
        path: 'product/:productId',
        component: SupplierProductComponent,
      }, {
        path: '**',
        redirectTo: 'product',
        pathMatch: 'full',
      }
    ],
  }, {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
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
export class SupplierRoutingModule {}
