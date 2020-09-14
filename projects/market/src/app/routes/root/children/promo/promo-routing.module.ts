import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromoFirstOrderComponent, PromoListComponent, PromoSchoolOfficeComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: PromoListComponent,
  },
  {
    path: 'first-order',
    component: PromoFirstOrderComponent,
  },
  {
    path: 'school-office',
    component: PromoSchoolOfficeComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromoRoutingModule {}
