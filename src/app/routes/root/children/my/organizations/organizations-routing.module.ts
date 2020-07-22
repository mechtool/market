import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationsComponent } from './organizations.component';
import { AuthOrganizationGuard } from '#shared/modules/setup-services/auth-organization.guard';

const routes: Routes = [
  {
    path: '',
    component: OrganizationsComponent,
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
export class OrganizationsRoutingModule {}
