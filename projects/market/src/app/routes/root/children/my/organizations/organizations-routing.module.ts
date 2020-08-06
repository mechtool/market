import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationsComponent } from './organizations.component';
import { SingleOrganizationComponent } from './components/single-organization/single-organization.component';
import { SingleOrganizationGuard } from './guards';

const routes: Routes = [
  {
    path: '',
    component: OrganizationsComponent,
  }, {
    path: ':id',
    component: SingleOrganizationComponent,
    canActivate: [SingleOrganizationGuard]
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
export class OrganizationsRoutingModule {}
