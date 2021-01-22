import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PromoListComponent,
  PromoFirstOrderComponent,
  PromoSchoolOfficeComponent,
  PromoPodarokPolozhenieComponent,
  PromoPodarokComponent
} from './components';

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
    path: 'podarok',
    children: [
      {
        path: '',
        component: PromoPodarokComponent,
      },
      {
        path: 'polozhenie',
        component: PromoPodarokPolozhenieComponent,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      }
    ]
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
