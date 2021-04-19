import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SalesComponent } from './sales.component';
import { PriceListCreatingFormComponent, PriceListEditingFormComponent } from './components';
import { AuthOrganizationGuard } from '#shared/modules/setup-services/auth-organization.guard';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    canActivate: [AuthOrganizationGuard],
  },
  {
    path: 'create',
    component: PriceListCreatingFormComponent,
    canActivate: [AuthOrganizationGuard],
  }, {
    path: 'edit/:priceListExternalId',
    component: PriceListEditingFormComponent,
    canActivate: [AuthOrganizationGuard],
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
export class SalesRoutingModule {

}
