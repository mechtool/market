import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent, CategorySingleComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: CategoryListComponent,
  }, {
    path: ':id',
    component: CategorySingleComponent,
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
export class CategoryRoutingModule {}
