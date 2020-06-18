import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent, CategoryComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
  }, {
    path: ':id',
    component: CategoryComponent
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
export class CategoryRoutingModule {
}
