import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { AuthOrganizationGuard } from '#shared/modules/setup-services/auth-organization.guard';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    canActivate: [AuthOrganizationGuard],
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
export class OrdersRoutingModule {}
