import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierListComponent, SupplierSingleComponent, TradeOfferComponent } from './components';
import { AuthOrganizationGuard } from '#shared/modules/setup-services/auth-organization.guard';

const routes: Routes = [
  {
    path: '',
    component: SupplierListComponent
  }, {
    path: ':supplierId',
    canActivate: [AuthOrganizationGuard],
    children: [
      {
        path: '',
        component: SupplierSingleComponent
      }, {
        path: 'offer/:tradeOfferId',
        component: TradeOfferComponent,
        // todo вынести этот, чтобы он был типа https://bnet-mynew-stage.1c.ru/offer/{:tradeOfferId} задача BNET-2955
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
