import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '#shared/modules';
import { RootComponent } from './routes/root/root.component';
import { DelayedPreloadingStrategy } from '#shared/modules/setup-services';

const routes: Routes = [
  {
    path: 'login',
    data: { preload: false },
    loadChildren: () => import('./routes/login/login.module').then(m => m.LoginModule)
  }, {
    path: '',
    component: RootComponent,
    children: [
      {
        path: '',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/products/products.module').then(m => m.ProductsModule),
      }, {
        path: 'search',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/search/search.module').then(m => m.SearchModule)
      }, {
        path: 'basket',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/basket/basket.module').then(m => m.BasketModule)
      }, {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      }
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: DelayedPreloadingStrategy }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

