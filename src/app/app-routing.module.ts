import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, SsoTicketGuard } from '#shared/modules';
import { RootComponent } from './routes/root/root.component';
import { DelayedPreloadingStrategy } from '#shared/modules/setup-services';

const routes: Routes = [
  {
    path: 'login',
    data: { preload: false },
    loadChildren: () => import('./routes/login/login.module').then(m => m.LoginModule),
  }, {
    path: '',
    canActivate: [SsoTicketGuard],
    component: RootComponent,
    children: [
      {
        path: '',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/product/product.module').then(m => m.ProductModule),
      }, {
        path: 'search',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/search/search.module').then(m => m.SearchModule),
      }, {
        path: 'supplier',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/supplier/supplier.module').then(m => m.SupplierModule),
      }, {
        path: 'cart',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/cart/cart.module').then(m => m.CartModule),
      }, {
        path: 'category',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/category/category.module').then(m => m.CategoryModule),
      }, {
        path: 'checkout',
        canActivate: [AuthGuard],
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/checkout/checkout.module').then(m => m.CheckoutModule),
      }, {
        path: 'about',
        data: { preload: false },
        loadChildren: () => import('./routes/root/children/about/about.module').then(m => m.AboutModule),
      }, {
        path: 'my',
        canActivate: [AuthGuard],
        children: [
          {
            path: 'orders',
            data: { preload: false },
            loadChildren: () => import('./routes/root/children/my/orders/orders.module').then(m => m.OrdersModule),
          }, {
            path: 'organizations',
            data: { preload: false },
            loadChildren: () => import('./routes/root/children/my/organizations/organizations.module').then(m => m.OrganizationsModule),
          }, {
            path: '**',
            redirectTo: 'orders',
            pathMatch: 'full',
          }
        ],
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

