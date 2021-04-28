import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  PromoFirstOrderComponent,
  PromoPodarokComponent,
  PromoPodarokParticipantsListComponent,
  PromoPodarokPolozhenieComponent,
  PromoSchoolOfficeComponent
} from './components';

const routes: Routes = [
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
        path: 'participants-list',
        component: PromoPodarokParticipantsListComponent,
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
export class PromoRoutingModule {
}
