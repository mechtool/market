import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RfpsComponent } from './rfps.component';
import { AuthOrganizationGuard } from '#shared/modules/setup-services/auth-organization.guard';
import { RfpEditComponent } from './components/rfp-edit/rfp-edit.component';

const routes: Routes = [
  {
    path: '',
    component: RfpsComponent,
    canActivate: [AuthOrganizationGuard],
  },
  {
    path: 'create',
    component: RfpEditComponent,
    canActivate: [AuthOrganizationGuard],
  }, {
    path: 'edit/:id',
    component: RfpEditComponent,
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
export class RfpsRoutingModule {}
