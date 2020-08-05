import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierListComponent, SupplierSingleComponent, TradeOfferComponent } from './components';
import { AuthGuard } from '#shared/modules';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: SupplierListComponent
  }, {
    path: ':supplierId',
    children: [
      {
        path: '',
        component: SupplierSingleComponent
      }, {
        path: 'offer/:tradeOfferId',
        component: TradeOfferComponent,
        // todo вынести этот, чтобы он был типа https://bnet-market-stage.1c.ru/offer/{:tradeOfferId} задача BNET-2955
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
export class SupplierRoutingModule {
}
